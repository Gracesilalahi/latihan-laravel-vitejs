<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * 🟢 Index: List Todo + Search + Filter + Pagination + Statistik Chart
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Todo::where('user_id', $user->id);

        // 🔍 Search (judul & catatan)
        if ($request->filled('search')) {
            $q = $request->input('search');
            $query->where(function ($builder) use ($q) {
                $builder->where('title', 'like', "%{$q}%")
                        ->orWhere('note', 'like', "%{$q}%");
            });
        }

        // 🧾 Filter status (pending/done)
        if ($request->filled('status') && in_array($request->status, [Todo::STATUS_PENDING, Todo::STATUS_DONE])) {
            $query->where('status', $request->status);
        }

        // 📑 Pagination 20 data / halaman
        $todos = $query->orderBy('due_date', 'asc')
            ->paginate(20)
            ->withQueryString();

        // 🖼️ Tambahkan URL cover untuk tiap todo
        $todos->getCollection()->transform(function ($todo) {
            $todo->cover_url = $todo->cover ? Storage::url($todo->cover) : null;
            return $todo;
        });

        // 📊 Statistik untuk chart (ApexCharts)
        $total = Todo::where('user_id', $user->id)->count();
        $done = Todo::where('user_id', $user->id)->where('status', Todo::STATUS_DONE)->count();
        $pending = $total - $done;

        $stats = [
            'total' => $total,
            'done' => $done,
            'pending' => $pending,
            'series' => [$done, $pending],
            'labels' => ['Done', 'Pending'],
        ];

        return Inertia::render('Todos/Index', [
            'todos' => $todos,
            'filters' => $request->only('search', 'status'),
            'stats' => $stats,
        ]);
    }

    /**
     * 🟢 Form Tambah Todo
     */
    public function create()
    {
        return Inertia::render('Todos/Form', [
            'todo' => new Todo(),
        ]);
    }

    /**
     * 🟢 Simpan Todo Baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'note' => 'nullable|string',
            'status' => 'nullable|in:' . Todo::STATUS_PENDING . ',' . Todo::STATUS_DONE,
            'due_date' => 'nullable|date',
            'cover' => 'nullable|image|max:2048',
        ]);

        $validated['status'] = $validated['status'] ?? Todo::STATUS_PENDING;
        $validated['user_id'] = auth()->id();

        // 🖼️ Upload cover jika ada
        if ($request->hasFile('cover')) {
            $validated['cover'] = $request->file('cover')->store('covers', 'public');
        }

        Todo::create($validated);

        return redirect()->route('todos.index')->with('success', '🎉 Todo berhasil dibuat!');
    }

    /**
     * 🟢 Form Edit Todo
     */
    public function edit(Todo $todo)
    {
        $this->authorizeOwner($todo);

        $todo->cover_url = $todo->cover ? Storage::url($todo->cover) : null;

        return Inertia::render('Todos/Form', [
            'todo' => $todo,
        ]);
    }

    /**
     * 🟢 Update Todo
     */
    public function update(Request $request, Todo $todo)
    {
        $this->authorizeOwner($todo);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'note' => 'nullable|string',
            'status' => 'nullable|in:' . Todo::STATUS_PENDING . ',' . Todo::STATUS_DONE,
            'due_date' => 'nullable|date',
            'cover' => 'nullable|image|max:2048',
        ]);

        // Ganti cover jika ada file baru
        if ($request->hasFile('cover')) {
            if ($todo->cover && Storage::disk('public')->exists($todo->cover)) {
                Storage::disk('public')->delete($todo->cover);
            }
            $validated['cover'] = $request->file('cover')->store('covers', 'public');
        }

        $todo->update($validated);

        return redirect()->route('todos.index')->with('success', '✅ Todo berhasil diupdate!');
    }

    /**
     * 🟢 Hapus Todo
     */
    public function destroy(Todo $todo)
    {
        $this->authorizeOwner($todo);

        if ($todo->cover && Storage::disk('public')->exists($todo->cover)) {
            Storage::disk('public')->delete($todo->cover);
        }

        $todo->delete();

        return redirect()->route('todos.index')->with('success', '🗑️ Todo berhasil dihapus!');
    }

    /**
     * 🔒 Cek kepemilikan data
     */
    private function authorizeOwner(Todo $todo)
    {
        if ($todo->user_id !== auth()->id()) {
            abort(403, 'Tidak memiliki akses ke data ini.');
        }
    }
}
