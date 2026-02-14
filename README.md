# Comprehensive Node.js Async Patterns & Best Practices

This repository demonstrates advanced asynchronous patterns, event loop behavior, API handling, and security best practices in Node.js.

## 📚 Table of Contents
1.  [Event Loop & Execution Order](#1-event-loop--execution-order)
2.  [Async/Await vs Promises](#2-asyncawait-vs-promises)
3.  [Parallel Execution Patterns](#3-parallel-execution-patterns)
4.  [Axios vs Fetch: A Detailed Comparison](#4-axios-vs-fetch-a-detailed-comparison)
5.  [Security Best Practices](#5-security-best-practices)

---

### 1. Event Loop & Execution Order
Node.js processes code in specific phases. Understanding the priority of different queues is crucial for predicting output:
*   **Microtask Queue (Highest Priority):** `process.nextTick()`, `Promise.then()`.
*   **Macrotask Queue (Lower Priority):** `setTimeout()`, `setImmediate()`, I/O callbacks.
*   **Key Rule:** Once the Microtask Queue starts processing, Node.js will drain the **entire queue** before moving to the next phase.

---

### 2. Async/Await vs Promises
**Recommendation:** Use **Async/Await** for almost all business logic.

| Feature | Async/Await | Raw Promises `.then()` |
| :--- | :--- | :--- |
| **Readability** | Looks synchronous, easy to read top-to-bottom. | Can lead to "Callback Hell" nesting. |
| **Error Handling** | Standard `try...catch` blocks. | Requires `.catch()` chaining. |
| **Debugging** | Stack traces point to exact lines. | Stack traces can be obscure inside chains. |

---

### 3. Parallel Execution Patterns
When running multiple async operations simultaneously, choose the right Promise combinator:

#### A. `Promise.all([p1, p2, p3])` *(Fail-Fast)*
*   **Behavior:** Runs all in parallel. Fails immediately if **ANY ONE** promise rejects.
*   **Use Case:** When you need *all* data to create a complete response (e.g., fetching User + Profile + Settings).

#### B. `Promise.allSettled([p1, p2, p3])` *(Resilient)*
*   **Behavior:** Runs all in parallel and waits for **ALL** to finish, regardless of success or failure.
*   **Use Case:** When partial failure is acceptable (e.g., fetching independent widgets for a dashboard).

#### C. `Promise.race([p1, p2])` *(Fastest Wins)*
*   **Behavior:** Returns the result of the **FIRST** promise to settle (Success OR Failure).
*   **Use Case:** Implementing timeouts (e.g., race an API call against a 5-second timer).

#### D. `Promise.any([p1, p2])` *(Optimistic)*
*   **Behavior:** Returns the result of the **FIRST SUCCESSFUL** promise. Fails only if ALL fail.
*   **Use Case:** Redundant systems (e.g., calling 3 different CDN servers for the same file).

---

### 4. Axios vs Fetch: A Detailed Comparison
We chose **Axios** for this project. Here is why:

| Feature | Axios | Native Fetch |
| :--- | :--- | :--- |
| **JSON Response** | **Automatic**: Returns parsed JSON in `response.data`. | **Manual**: Requires two steps: `await response.json()`. |
| **Error Handling** | **Automatic**: Rejects promise on 4xx/5xx status codes (e.g., 404, 500). | **Manual**: Only rejects on network failure. You must manually check `if (!res.ok) throw new Error()`. |
| **Request Interceptors** | **Native Support**: Can modify requests globally (e.g., adding Auth tokens to every request). | **No Support**: Requires custom wrapper functions. |
| **Timeouts** | **Configureable**: Easy `timeout` option in config. | **Complex**: Requires `AbortController` implementation. |
| **Browser Support** | **Excellent**: Works in older browsers (IE11) automatically. | **Limited**: Requires polyfills for older browsers. |

**Verdict:** Use **Axios** for complex applications requiring robust error handling and interceptors. Use **Fetch** only for simple scripts where zero dependencies are prioritized.

---

### 5. Security Best Practices
We have implemented several security middlewares to protect the application:

#### A. `helmet` (Secure HTTP Headers)
`helmet` sets various HTTP headers to secure the app. Here is a detailed breakdown of what each header does and which attack it prevents:

| Header | What it does | Attack Prevention |
| :--- | :--- | :--- |
| **`X-DNS-Prefetch-Control`** | Controls browser DNS prefetching. By default, browsers try to resolve domain names in links before a user clicks them. | **Privacy Leak / Spoofing**: Prevents attackers from forcing the browser to resolve domains that could leak user privacy or be used for tracking. Disabling it ensures DNS lookups only happen on explicit user action. |
| **`X-Frame-Options`** | Tells the browser whether your site can be displayed in a `<frame>`, `<iframe>`, or `<object>`. | **Clickjacking**: Prevents attackers from embedding your site in an invisible iframe on their malicious site and tricking users into clicking buttons (like "Transfer Money") without realizing it. |
| **`Strict-Transport-Security` (HSTS)** | Forces browsers to ONLY communicate with your server over HTTPS for a specified duration (e.g., 1 year). | **Protocol Downgrade / Man-in-the-Middle (MitM)**: Prevents attackers from downgrading a secure HTTPS connection to an insecure HTTP connection where they can steal cookies or data. |
| **`X-Content-Type-Options`** | Sets `nosniff`, preventing the browser from "guessing" (sniffing) the MIME type of a file. | **MIME Sniffing Attacks**: Prevents a browser from executing a file as a script if the server said it was an image (e.g., executing a malicious `.jpg` that actually contains JavaScript). |
| **`X-Powered-By`** | **(Removed by Helmet)**: By default, Express sends this header saying `Express`. Helmet removes it. | **Information Disclosure**: Hiding technology details makes it slightly harder for attackers to launch targeted exploits against specific versions of your server stack. |
| **`Referrer-Policy`** | Controls how much referrer information (the URL the user came from) is sent with requests. | **Privacy Leak**: Prevents leaking sensitive URL parameters (like session IDs in URLs) to third-party sites when users click links. |

#### B. `cors` (Cross-Origin Resource Sharing)
*   **What it does:** Controls which domains can access your API resources.
*   **Why use it:** Prevents unauthorized websites from making requests to your API. By default, browsers block cross-origin requests for security.

#### C. `express-rate-limit` (DDoS Protection)
*   **What it does:** Limits the number of requests a client can make in a given timeframe.
*   **Why use it:** Protects your server from Brute Force attacks and Denial of Service (DDoS) attacks by blocking IPs that send too many requests.

#### D. `hpp` (HTTP Parameter Pollution Prevention)
*   **What it does:** Prevents attacks that exploit how servers handle multiple query parameters with the same name.
*   **Why use it:** Attackers can bypass input validation or cause unexpected behavior by sending polluted query strings (e.g., `?id=1&id=2`).

---

## 🚀 How to Run

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start Dev Server:**
    ```bash
    npm run dev
    ```
3.  **Test API:**
    *   GET `http://localhost:3000/api/data/products` (Triggers Parallel API calls logic)
