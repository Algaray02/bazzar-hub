# 📘 **Next.js 16 — Production Architecture Guide (Recommended Pattern)**

*Server-First • Scalable • Clean • Enterprise-Ready*

---

# # 📐 **High-Level System Architecture**

```
                        ┌─────────────────────────┐
                        │        UI Layer         │
                        │  (Server & Client RSC)  │
                        │  Components / Pages     │
                        └─────────────┬───────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │      Query Hooks        │
                        │   (React Query - GET)   │
                        └─────────────┬───────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │   Route Handlers (GET)  │
                        │   app/api/.../route.js  │
                        │  Purely for fetching    │
                        └─────────────┬───────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │       Services          │
                        │ Business Logic / Rules  │
                        └─────────────┬───────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │      Repository         │
                        │   (DB queries only)     │
                        └─────────────┬───────────┘
                                      │
                                      ▼
                               ┌───────────┐
                               │  Database │
                               └───────────┘


                        ┌─────────────────────────┐
                        │   Mutation Hooks (RQ)   │
                        │       (useMutation)     │
                        └─────────────┬───────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │     Server Actions      │
                        │   (Mutations Only)      │
                        │ validation, auth, reval │
                        └─────────────┬───────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │       Services          │
                        │ Business Logic / Rules  │
                        └─────────────┬───────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │      Repository         │
                        │   (DB queries only)     │
                        └─────────────┬───────────┘
                                      │
                                      ▼
                               ┌───────────┐
                               │  Database │
                               └───────────┘
```

---

# # 🧩 **Layer Explanation**

---

## ## 1. UI Layer

**Lokasi:** `app/...` (Server & Client Components)

### **Tugas:**

* Menampilkan data
* Meng-handle interaksi user
* Memanggil React Query Hooks
* Memanggil Server Actions via form atau mutation

### **Tidak boleh:**

* Query DB
* Logic bisnis
* Validasi backend
* Auth, hashing, permission
* Mutasi database

---

## ## 2. Query Hooks (React Query — GET Only)

**Lokasi:** `hooks/...`

### **Tugas:**

* Fetch GET untuk UI yang interaktif
* Provide caching, reactivity, polling, stale-time
* Mengambil data dari Route Handler

### **Tidak boleh:**

* Mutasi database
* Logic bisnis

---

## ## 3. Route Handlers (GET Only)

**Lokasi:** `app/api/.../route.js`

### **Tugas:**

* Mengambil data (pure fetch)
* Memanggil service untuk read operations
* Edge-ready & cacheable

### **Tidak boleh:**

* Mutasi
* Auth logic
* Validasi form
* revalidatePath()

---

## ## 4. Services (Business Logic)

**Lokasi:** `lib/services/...`

### **Tugas:**

* Meng-handle rules & decision-making
* Validasi domain
* Menggabungkan beberapa repository call
* Menjadi otak utama aplikasi

### **Tidak boleh:**

* Query database langsung
* Interaksi dengan cache
* handle FormData

---

## ## 5. Repository Layer (Database Queries Only)

**Lokasi:** `lib/repositories/...`

### **Tugas:**

* Query database via Prisma/Supabase/etc
* Satu-satunya layer yang boleh menyentuh DB

### **Tidak boleh:**

* Business logic
* Validasi
* Auth

---

## ## 6. Server Actions (POST/PUT/PATCH/DELETE Only)

**Lokasi:** `app/actions/...`

### **Tugas:**

* Menangani mutasi data
* Auth, permission
* Validasi input (Zod)
* Memanggil service
* Memanggil revalidatePath()

### **Tidak boleh:**

* Query DB langsung
* GET request

---

## ## 7. Mutation Hooks (React Query)

**Lokasi:** `hooks/...`

### **Tugas:**

* Menjalankan server action dari client
* Memberikan: loading state, error, success, refetch

### **Tidak boleh:**

* Logic bisnis

---

## ## 8. Database Layer

**Tugas:**

* Penyimpanan data
* Reaksi terhadap query dari repository

---

# # 🔄 **Data Flow**

---

## ## **GET Data Flow (Recommended)**

```
UI → Query Hook → Route Handler → Service → Repository → DB
```

### Contoh GET:

* list users
* list events
* list products

---

## ## **POST / PUT / DELETE Flow (Mutations)**

```
UI → Mutation Hook → Server Action → Service → Repository → DB
```

### Contoh POST:

* register user
* create event
* update booth

---

# # 📁 **Folder Structure (Final Recommended)**

```
app/
  (auth)/
    register/
      page.jsx
  api/
    users/
      route.js
  actions/
    registerUser.js
    updateUser.js
    deleteUser.js

components/
  forms/
  ui/

hooks/
  useRegisterUser.js
  useUsers.js

lib/
  repositories/
    userRepository.js
  services/
    userService.js
  validators/
    userValidator.js
  utils/
    formatter.js

public/
styles/
```

---

# # 📦 **Why This Architecture Works (Next.js 16 Optimized)**

### **✓ Server-first**

Next.js 16 memprioritaskan server actions + route handlers.

### **✓ Scalable**

Aplikasi besar yang terus berkembang akan tetap mudah dirawat.

### **✓ Testable**

Service & repository mudah di-unit-test.

### **✓ Clean**

UI tidak tercemar logic backend.

### **✓ Secure**

Mutasi tidak expose API endpoint.

### **✓ Maintainable**

Setiap folder punya tanggung jawab jelas.

---

# # 💡 **Rules to Follow**

### ✔ GET → Route Handler + Query Hook

### ✔ POST/PUT/DELETE → Server Actions + Mutation Hook

### ✔ Tidak ada DB logic di UI

### ✔ Tidak ada business logic di Route Handler

### ✔ Semua logic domain → Services

### ✔ Semua query ke DB → Repository
