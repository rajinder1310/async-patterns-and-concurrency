# Node.js Async Patterns & Security Best Practices

This repository demonstrates advanced asynchronous patterns, event loop behavior, and security best practices in Node.js.

---

## 📚 Core Concepts

### 1. Event Loop & Execution Order
Node.js uses a **single-threaded, non-blocking I/O model**.
*   **Synchronous Operations:** Block the main thread. Code executes line-by-line.
*   **Asynchronous Operations:** Offload tasks (like DB queries or HTTP requests) to the system kernel. When complete, their callbacks are placed in the **Event Queue** to be executed by the Event Loop.

### 2. Async/Await vs Promises
*   **Promises (`.then`):** Represent a value that may be available now, later, or never. Chaining `.then()` can lead to complex nested structures ("Promise Hell").
*   **Async/Await:** Syntactic sugar built on top of Promises. It allows writing asynchronous code that looks and behaves like synchronous code, making it easier to read and debug using standard `try...catch` blocks.

---

## 3. Concurrency Patterns (Promise Combinators)
When executing multiple asynchronous operations (like API calls) simultaneously, use the appropriate combinator:

### A. `Promise.all` (Fail-Fast)
*   **Behavior:** Executes all promises in parallel.
*   **Outcome:** Resolves with an array of results only if **ALL** promises succeed. Rejects immediately if **ANY** promise fails.
*   **Use Case:** Aggregating data where every part is required (e.g., Loading User Profile + Permissions + Settings).

### B. `Promise.allSettled` (Complete Execution)
*   **Behavior:** Executes all promises in parallel and waits for all of them to finish, regardless of success or failure.
*   **Outcome:** Returns an array of objects describing the outcome of each promise (`{ status: 'fulfilled', value: ... }` or `{ status: 'rejected', reason: ... }`).
*   **Use Case:** Bulk operations where partial results are acceptable (e.g., Fetching stats from Independent Microservices).

### C. `Promise.race` (First Settled)
*   **Behavior:** Returns the result of the **first** promise to settle (either resolve or reject).
*   **Outcome:** The single faster result (good or bad).
*   **Use Case:** Implementing Request Timeouts (e.g., Racing a Network Request against a 5000ms Timer).

### D. `Promise.any` (First Success)
*   **Behavior:** Returns the result of the **first successfully fulfilled** promise.
*   **Outcome:** The first valid data found. Ignores errors unless **ALL** promises fail.
*   **Use Case:** Redundancy (e.g., Querying multiple CDNs for an asset and using the fastest successful response).

---

## 4. HTTP Client: Axios vs Fetch
| Feature | Axios (Library) | Fetch (Native) |
| :--- | :--- | :--- |
| **JSON Parsing** | **Automatic** (`res.data`) | **Manual** (`await res.json()`) |
| **Error Handling** | **Automatic** (Throws on 4xx/5xx) | **Manual** (Must check `!res.ok`) |
| **Interceptors** | Supported (Request/Response) | Not Supported natively |

**Verdict:** We use **Axios** for its robust error handling and simplified API.

---

## 5. Security Middlewares (Protection Layers)

1.  **Helmet:** Sets secure HTTP headers (e.g., `Strict-Transport-Security`, `X-Frame-Options`) preventing attacks like **Clickjacking** and **Man-in-the-Middle**.
2.  **CORS:** Configures **Cross-Origin Resource Sharing** to restrict which domains are permitted to access the API.
3.  **Rate Limit:** Limits the request frequency from a single IP address to mitigate **Brute-Force** and **DDoS** attacks.
4.  **HPP (HTTP Parameter Pollution):** Sanitizes requests to prevent attackers from exploiting logic errors by sending duplicate query parameters (e.g., `?id=1&id=2`).

---

## 🚀 Usage

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run Application:**
    ```bash
    npm run dev
    ```
3.  **Test Endpoint:**
    *   `GET http://localhost:3000/api/data/products`
