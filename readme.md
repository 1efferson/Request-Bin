

---


# 🚀 Mini Request Bin: The Zero-Latency Debugging Tool

## 🧭 Overview

**Mini Request Bin** is a self-hosted, simplified diagnostic tool designed to inspect, log, and visualize inbound HTTP requests and webhooks in real-time.

It transforms complex API debugging into an intuitive, transparent experience, making it perfect for both educational use and development testing.

⚡ It operates on a **zero-latency** principle, ensuring that all header, query, and body data are captured and available for viewing instantly.

---

## ✨ Key Features

- **Universal Capture Endpoint**  
  A single, robust endpoint that handles all HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`, etc.).

- **Real-time Log Streaming**  
  Instantly see incoming requests logged in the viewer (requires manual refresh in the current Jinja setup).

- **Detailed Inspection**  
  Easily view request headers, query parameters, and JSON/form-encoded body payloads.

- **Educational Focus**  
  Provides a transparent view of the request lifecycle — ideal for teaching API interaction and network fundamentals.

- **Agency-Style UI**  
  A clean, high-contrast interface built with Tailwind CSS for exceptional visual clarity.

---

## 💡 Usage Guide

### 1. The Capture Endpoint

To log a request, send any HTTP request to the designated path:

```

http://localhost:5000/bin/demo

````

#### Example using `cURL`:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from API client", "status": "success"}' \
  [Your Base URL]/bin/demo
````

---

### 2. Viewing the Live Log

Navigate to the log viewer page to see captured requests:

```
[Your Base URL]/bin/demo/view
```

Each inbound request will be displayed as a **distinct card**, color-coded by its HTTP method (e.g., green for `POST`, blue for `GET`).

---

## 🛠️ Technology Stack

| Layer          | Tech                   |
| -------------- | ---------------------- |
| **Backend**    | Python (`Flask`)       |
| **Templating** | Jinja2                 |
| **Frontend**   | Tailwind CSS           |

---

## 🚀 Installation & Setup

> **Note:** Assumes a standard Python/Flask project structure with a blueprint.

### 1. Clone the Repository

```bash
git clone https://github.com/1efferson/Request-Bin.git
cd folder Name
```

### 2. Set Up Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Run the Application

```bash
flask run
```

By default, the app will be available at:

```
http://127.0.0.1:5000 or 8000
```


