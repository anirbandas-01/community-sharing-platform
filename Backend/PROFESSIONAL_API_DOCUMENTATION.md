# Professional Dashboard API Integration

## Overview

This document describes the backend API integration for the Professional Dashboard. All APIs are protected with Laravel Sanctum authentication and require the `role:professional` middleware.

## Base URL

```
/api/professional
```

## Authentication

All requests must include the Bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

## Available Endpoints

### 1. Get Dashboard Data

**Endpoint:** `GET /api/professional/dashboard`

**Description:** Retrieves comprehensive dashboard statistics for the professional.

**Response:**

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "profile": {
    "bio": "Certified professional...",
    "specialization": "Plumbing",
    "experience_years": 5,
    ...
  },
  "stats": {
    "total_services": 5,
    "active_services": 4,
    "total_appointments": 50,
    "upcoming_appointments": 10,
    "pending_appointments": 3,
    "total_earnings": 25000.00,
    "popular_service": "Home Plumbing Repair"
  }
}
```

### 2. Get Profile

**Endpoint:** `GET /api/professional/profile`

**Description:** Retrieves the professional's profile information.

**Response:**

```json
{
    "id": 1,
    "user_id": 1,
    "bio": "Certified professional with 5+ years of experience",
    "specialization": "Plumbing",
    "experience_years": 5,
    "qualifications": "Licensed Plumber",
    "hourly_rate": 500.0,
    "consultation_fee": 200.0,
    "services_offered": "Residential and Commercial",
    "availability": "Mon-Sat, 9AM-6PM"
}
```

### 3. Update Profile

**Endpoint:** `PUT /api/professional/profile`

**Description:** Updates the professional's profile information.

**Request Body:**

```json
{
    "bio": "Updated bio",
    "specialization": "Plumbing",
    "experience_years": 6,
    "qualifications": "Licensed Plumber",
    "hourly_rate": 550.0,
    "consultation_fee": 250.0,
    "services_offered": "All types of plumbing",
    "availability": "Mon-Sat, 9AM-7PM"
}
```

**Response:**

```json
{
  "message": "Profile updated successfully",
  "profile": { ... }
}
```

### 4. List Services

**Endpoint:** `GET /api/professional/services`

**Description:** Retrieves all services offered by the professional.

**Response:**

```json
[
    {
        "id": 1,
        "professional_id": 1,
        "name": "Home Plumbing Repair",
        "description": "General plumbing repairs and maintenance",
        "price": 1500.0,
        "duration": 60,
        "category": "Plumbing",
        "is_active": true,
        "appointments_count": 45,
        "created_at": "2026-02-04T10:00:00.000000Z",
        "updated_at": "2026-02-04T10:00:00.000000Z"
    }
]
```

### 5. Add Service

**Endpoint:** `POST /api/professional/services`

**Description:** Creates a new service.

**Request Body:**

```json
{
    "name": "Emergency Plumbing",
    "description": "24/7 emergency plumbing services",
    "price": 2500.0,
    "duration": 120,
    "category": "Plumbing"
}
```

**Response:**

```json
{
  "message": "Service added successfully",
  "service": { ... }
}
```

### 6. Get Appointments

**Endpoint:** `GET /api/professional/appointments`

**Description:** Retrieves all appointments for the professional with related user and service data.

**Response:**

```json
[
    {
        "id": 1,
        "user_id": 5,
        "professional_id": 1,
        "service_id": 1,
        "appointment_time": "2026-02-10T14:00:00.000000Z",
        "notes": "Leaking pipe in kitchen",
        "status": "pending",
        "total_price": 1500.0,
        "user": {
            "id": 5,
            "name": "Jane Smith",
            "email": "jane@example.com"
        },
        "service": {
            "id": 1,
            "name": "Home Plumbing Repair",
            "price": 1500.0
        }
    }
]
```

### 7. Update Appointment

**Endpoint:** `PUT /api/professional/appointments/{id}`

**Description:** Updates the status of an appointment.

**Request Body:**

```json
{
    "status": "confirmed"
}
```

**Valid Status Values:**

- `pending`
- `confirmed`
- `cancelled`
- `completed`

**Response:**

```json
{
  "message": "Appointment updated successfully",
  "appointment": { ... }
}
```

### 8. Get Earnings

**Endpoint:** `GET /api/professional/earnings`

**Description:** Retrieves earnings statistics and recent completed appointments.

**Response:**

```json
{
    "total_earnings": 25000.0,
    "this_month": 5000.0,
    "last_month": 4500.0,
    "percentage_change": 11.11,
    "recent_earnings": [
        {
            "id": 10,
            "appointment_time": "2026-02-03T10:00:00.000000Z",
            "total_price": 1500.0,
            "status": "completed",
            "user": {
                "name": "John Client"
            },
            "service": {
                "name": "Home Plumbing Repair"
            }
        }
    ]
}
```

### 9. Get Reviews

**Endpoint:** `GET /api/professional/reviews`

**Description:** Retrieves reviews and ratings (currently returns mock data).

**Response:**

```json
{
    "average_rating": 4.5,
    "total_reviews": 0,
    "reviews": []
}
```

## Database Schema

### Services Table

```sql
- id (bigint, primary key)
- professional_id (bigint, foreign key -> users.id)
- name (varchar)
- description (text, nullable)
- price (decimal 10,2)
- duration (integer, nullable) - in minutes
- category (varchar, nullable)
- is_active (boolean, default: true)
- created_at (timestamp)
- updated_at (timestamp)
```

### Appointments Table

```sql
- id (bigint, primary key)
- user_id (bigint, foreign key -> users.id)
- professional_id (bigint, foreign key -> users.id)
- service_id (bigint, foreign key -> services.id, nullable)
- appointment_time (datetime)
- notes (text, nullable)
- status (enum: pending, confirmed, cancelled, completed)
- total_price (decimal 10,2, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

## Frontend Integration

### JavaScript API Calls Example

```javascript
// API Configuration
const API_BASE = "/api";
const token = localStorage.getItem("auth_token");

const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
};

// Load Dashboard Data
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE}/professional/dashboard`, {
            headers: authHeaders,
        });

        if (!response.ok) throw new Error("Failed to load dashboard");

        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error("Dashboard error:", error);
    }
}

// Confirm Appointment
async function confirmAppointment(id) {
    try {
        const response = await fetch(
            `${API_BASE}/professional/appointments/${id}`,
            {
                method: "PUT",
                headers: authHeaders,
                body: JSON.stringify({ status: "confirmed" }),
            },
        );

        if (response.ok) {
            alert("Appointment confirmed!");
            loadAppointments();
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK` - Successful GET/PUT requests
- `201 Created` - Successful POST requests
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `401 Unauthorized` - Authentication failed
- `403 Forbidden` - Insufficient permissions

## Next Steps

1. **Create Reviews Table & Model** - Implement a proper reviews system
2. **Add Service Update/Delete Endpoints** - Allow professionals to edit/remove services
3. **Implement Real-time Notifications** - Use Laravel Broadcasting for live updates
4. **Add Payment Integration** - Connect with payment gateways for earnings
5. **Implement Calendar View** - Create a calendar interface for appointments
6. **Add Analytics Dashboard** - Detailed charts and graphs for business insights

## Testing

To test the APIs, you can use tools like:

- **Postman** - Import the endpoints and test with your auth token
- **Thunder Client** (VS Code extension) - Test directly in your editor
- **Browser DevTools** - Monitor network requests from the frontend

## Notes

- All monetary values are stored as decimal(10,2) in the database
- Timestamps are stored in UTC and should be converted to local time in the frontend
- The `role:professional` middleware ensures only professionals can access these endpoints
- Relationships are eager-loaded where necessary to reduce database queries
