<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Appointments - LocalHub</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    @include('components.styles')

    <style>
        /* Appointments Specific Styles */
        .appointments-grid {
            display: grid;
            gap: 16px;
        }

        .appointment-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.2s;
        }

        .appointment-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .appointment-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 16px;
        }

        .client-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .client-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 18px;
        }

        .client-details h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
        }

        .client-details p {
            font-size: 13px;
            color: #64748b;
        }

        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-badge.confirmed {
            background: #d1fae5;
            color: #065f46;
        }

        .status-badge.pending {
            background: #fef3c7;
            color: #92400e;
        }

        .status-badge.completed {
            background: #dbeafe;
            color: #1e40af;
        }

        .status-badge.cancelled {
            background: #fee2e2;
            color: #991b1b;
        }

        .appointment-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 16px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
        }

        .detail-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #475569;
        }

        .detail-item i {
            color: #2563eb;
            width: 20px;
        }

        .appointment-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .filter-tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
        }

        .filter-tab {
            padding: 12px 20px;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            color: #64748b;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: -2px;
        }

        .filter-tab:hover {
            color: #2563eb;
        }

        .filter-tab.active {
            color: #2563eb;
            border-bottom-color: #2563eb;
        }
    </style>
</head>

<body>
    @include('components.navbar', [
    'title' => 'Appointments',
    'searchPlaceholder' => 'Search appointments...',
    'userInitials' => 'JD'
    ])

    @include('components.professional-sidebar')

    <main class="main-content">
        <div>
            <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Appointments</h1>
            <p style="color: #64748b; margin-bottom: 32px;">Manage your appointments and bookings</p>

            <!-- Filter Tabs -->
            <div class="filter-tabs">
                <button class="filter-tab active" onclick="filterAppointments('all')">All</button>
                <button class="filter-tab" onclick="filterAppointments('pending')">Pending</button>
                <button class="filter-tab" onclick="filterAppointments('confirmed')">Confirmed</button>
                <button class="filter-tab" onclick="filterAppointments('completed')">Completed</button>
                <button class="filter-tab" onclick="filterAppointments('cancelled')">Cancelled</button>
            </div>

            <!-- Appointments Grid -->
            <div class="appointments-grid" id="appointments-container">
                <div style="text-align: center; padding: 48px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #cbd5e1;"></i>
                    <p style="color: #94a3b8; margin-top: 16px;">Loading appointments...</p>
                </div>
            </div>
        </div>
    </main>

    @include('components.profile-modal')

    @include('components.scripts')

    <script>
        let allAppointments = [];
        let currentFilter = 'all';
        let isLoading = false;

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', async function() {
            try {
                await loadAppointments();
            } catch (error) {
                console.error('Error initializing appointments page:', error);
                showEmptyState('Failed to load appointments. Please refresh the page.');
            }
        });

        // Load appointments from API - Optimized with better error handling
        async function loadAppointments() {
            if (isLoading) return; // Prevent duplicate requests

            isLoading = true;
            const container = document.getElementById('appointments-container');

            try {
                // Show loading state
                container.innerHTML = `
                    <div style="text-align: center; padding: 48px;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #cbd5e1;"></i>
                        <p style="color: #94a3b8; margin-top: 16px;">Loading appointments...</p>
                    </div>
                `;

                const response = await fetch(`${API_BASE}/professional/appointments`, {
                    method: 'GET',
                    headers: authHeaders
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: Failed to load appointments`);
                }

                const data = await response.json();
                allAppointments = Array.isArray(data) ? data : [];

                // Apply current filter
                const filtered = currentFilter === 'all' ?
                    allAppointments :
                    allAppointments.filter(apt => apt.status === currentFilter);

                renderAppointments(filtered);
            } catch (error) {
                console.error('Error loading appointments:', error);
                showEmptyState('Unable to load appointments. Please try again later.');
            } finally {
                isLoading = false;
            }
        }

        // Render appointments - Optimized with template caching
        function renderAppointments(appointments) {
            const container = document.getElementById('appointments-container');

            if (!appointments || appointments.length === 0) {
                showEmptyState(currentFilter === 'all' ?
                    'No appointments yet' :
                    `No ${currentFilter} appointments`);
                return;
            }

            // Use DocumentFragment for better performance
            const fragment = document.createDocumentFragment();
            const tempDiv = document.createElement('div');

            tempDiv.innerHTML = appointments.map(apt => createAppointmentCard(apt)).join('');
            container.innerHTML = tempDiv.innerHTML;
        }

        // Create appointment card HTML - Extracted for better maintainability
        function createAppointmentCard(apt) {
            const clientInitial = apt.client_name ? apt.client_name.charAt(0).toUpperCase() : 'C';
            const status = apt.status || 'pending';

            return `
                <div class="appointment-card">
                    <div class="appointment-header">
                        <div class="client-info">
                            <div class="client-avatar">${clientInitial}</div>
                            <div class="client-details">
                                <h3>${apt.client_name || 'Client'}</h3>
                                <p>${apt.service_name || 'Service'}</p>
                            </div>
                        </div>
                        <span class="status-badge ${status}">${status.toUpperCase()}</span>
                    </div>
                    
                    <div class="appointment-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${apt.date || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${apt.time || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-rupee-sign"></i>
                            <span>₹${apt.price || '0'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${apt.location || 'N/A'}</span>
                        </div>
                    </div>

                    <div class="appointment-actions">
                        ${getActionButtons(apt.id, status)}
                    </div>
                </div>
            `;
        }

         

        // Get action buttons based on status - Cleaner logic
        function getActionButtons(id, status) {
            const buttons = [];

            if (status === 'pending') {
                buttons.push(`
                    <button class="btn btn-primary" onclick="acceptAppointment(${id})">
                        <i class="fas fa-check"></i> Accept
                    </button>
                    <button class="btn btn-danger" onclick="rejectAppointment(${id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                `);
            } else if (status === 'confirmed') {
                buttons.push(`
                    <button class="btn btn-primary" onclick="updateAppointmentStatus(${id}, 'completed')">
                        <i class="fas fa-check-circle"></i> Mark Complete
                    </button>
                    <button class="btn btn-outline" onclick="updateAppointmentStatus(${id}, 'cancelled')">
                        <i class="fas fa-ban"></i> Cancel
                    </button>
                `);
            }

            buttons.push(`
                <button class="btn btn-outline" onclick="viewAppointmentDetails(${id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
            `);

            return buttons.join('');
        }

        // Filter appointments - Optimized
        function filterAppointments(status) {
            try {
                currentFilter = status;

                // Update active tab
                document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
                event.target.classList.add('active');

                // Filter and render
                const filtered = status === 'all' ?
                    allAppointments :
                    allAppointments.filter(apt => apt.status === status);

                renderAppointments(filtered);
            } catch (error) {
                console.error('Error filtering appointments:', error);
            }
        }

        // Update appointment status - Enhanced error handling
        async function updateAppointmentStatus(id, status) {
            if (!confirm(`Are you sure you want to ${status} this appointment?`)) {
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/professional/appointments/${id}`, {
                    method: 'PUT',
                    headers: authHeaders,
                    body: JSON.stringify({
                        status
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: Failed to update appointment`);
                }

                alert(`Appointment ${status} successfully!`);
                await loadAppointments();
            } catch (error) {
                console.error('Error updating appointment:', error);
                alert(`Failed to ${status} appointment. Please try again.`);
            }
        }

        async function acceptAppointment(id) {
            if (!confirm('Do you want to accept this appointment?')) {
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/professional/appointments/${id}`, {
                    method: 'PUT',
                    headers: authHeaders,
                    body: JSON.stringify({
                        status: 'confirmed'
                    })
                });

                if (!response.ok) throw new Error('Failed to accept appointment');

                alert('Appointment accepted successfully! ✅');
                await loadAppointments();
            } catch (error) {
                console.error('Error accepting appointment:', error);
                alert('Failed to accept appointment. Please try again.');
            }
        }
  
        async function rejectAppointment(id) {
            const reason = prompt('Please provide a reason for rejection (optional):');
            
            if (!confirm('Are you sure you want to reject this appointment?')) {
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/professional/appointments/${id}`, {
                    method: 'PUT',
                    headers: authHeaders,
                    body: JSON.stringify({
                        status: 'cancelled',
                        notes: reason ? `Rejected: ${reason}` : 'Rejected by professional'
                    })
                });

                if (!response.ok) throw new Error('Failed to reject appointment');

                alert('Appointment rejected');
                await loadAppointments();
            } catch (error) {
                console.error('Error rejecting appointment:', error);
                alert('Failed to reject appointment. Please try again.');
        }
                }
        // View appointment details - Improved
        function viewAppointmentDetails(id) {
            try {
                const appointment = allAppointments.find(apt => apt.id === id);

                if (!appointment) {
                    alert('Appointment not found');
                    return;
                }

                const details = [
                    `Client: ${appointment.client_name || 'N/A'}`,
                    `Service: ${appointment.service_name || 'N/A'}`,
                    `Date: ${appointment.date || 'N/A'}`,
                    `Time: ${appointment.time || 'N/A'}`,
                    `Price: ₹${appointment.price || '0'}`,
                    `Location: ${appointment.location || 'N/A'}`,
                    `Status: ${(appointment.status || 'pending').toUpperCase()}`
                ].join('\n');

                alert(`Appointment Details:\n\n${details}`);
            } catch (error) {
                console.error('Error viewing appointment details:', error);
                alert('Failed to load appointment details');
            }
        }

        // Show empty state
        function showEmptyState(message) {
            const container = document.getElementById('appointments-container');
            container.innerHTML = `
                <div style="text-align: center; padding: 64px 32px; background: white; border-radius: 12px;">
                    <i class="fas fa-calendar-times" style="font-size: 64px; color: #cbd5e1; margin-bottom: 16px;"></i>
                    <h3 style="font-size: 20px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">No Appointments</h3>
                    <p style="color: #64748b;">${message}</p>
                </div>
            `;
        }
    </script>
</body>

</html>