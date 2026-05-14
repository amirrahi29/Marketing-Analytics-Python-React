# Marketing Analytics Dashboard

## 🎥 Demo Video

<div align="center">

<a href="https://youtu.be/MBdqZB_CI3c" target="_blank">
  <img src="https://img.youtube.com/vi/MBdqZB_CI3c/maxresdefault.jpg" 
       alt="Marketing Analytics Dashboard Demo"
       width="800">
</a>

</div>

---

# Dashboard Screenshots 

<table>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/8bb1bcef-2319-4c1b-b6c5-24df28ef233b" width="100%">
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/bacafb2f-a2bb-43c7-8bfb-6761d0e37902" width="100%">
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/8ed1d09b-2e27-4fae-b0a2-d3a1257d432c" width="100%">
    </td>
  </tr>

  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/85e2a3f0-9b55-4a7b-9d9f-8f718fa53a4b" width="100%">
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/e20bde16-abc4-43d5-919a-af7a03cf151b" width="100%">
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/d69b3583-8cac-4e13-8193-98aa496b95ac" width="100%">
    </td>
  </tr>

  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/83ab309d-5f47-4b99-ba8f-b078462ea8e2" width="100%">
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/1bf832f4-52dc-4439-b139-d2f1d62009e7" width="100%">
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/54b3ea89-914b-413e-aacf-dc343e23d887" width="100%">
    </td>
  </tr>
</table>

---

# Project Overview

Marketing analytics platform built using Flask and React.

## Features

- Marketing KPI Dashboard
- Revenue Analytics
- Campaign Tracking
- Conversion Metrics
- ROI Analysis
- Interactive Charts
- Channel Performance Insights
- CSV-based Analytics Processing
- Responsive Modern UI

---

# Tech Stack

## Backend
- Python
- Flask
- Pandas
- NumPy

## Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- Recharts

---

# Backend Setup

```bash
cd backend

python -m venv venv

# Mac/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

Backend runs on:

```txt
http://127.0.0.1:5001
```

Make sure `general_data.csv` exists inside the backend folder.

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend development server starts automatically.

For production build:

```bash
npm run build
```

Production build output:

```txt
frontend/dist
```

---

# API Configuration

Frontend expects backend API at:

```txt
http://127.0.0.1:5001
```

If needed, update API URL in:

```txt
frontend/src/services/api.ts
```