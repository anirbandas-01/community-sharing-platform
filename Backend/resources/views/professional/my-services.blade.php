<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>My Services - LocalHub</title>
    <!-- Google Fonts for modern typography -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Include common styles component -->
    @include('components.styles')

    <style>
        /* Services Page Specific Styles */
        .services-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
        }

        .services-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: #2563eb;
            margin-bottom: 4px;
        }

        .stat-label {
            font-size: 14px;
            color: #64748b;
        }

        /* Service Card Styles */
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 24px;
        }

        .service-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
            position: relative;
        }

        .service-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }

        .service-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 16px;
        }

        .service-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }

        .service-description {
            font-size: 14px;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 16px;
        }

        .service-price {
            font-size: 24px;
            font-weight: 700;
            color: #10b981;
        }

        .service-meta {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            color: #64748b;
        }

        .meta-item i {
            color: #94a3b8;
        }

        /* Status Badge */
        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-badge.active {
            background: #d1fae5;
            color: #065f46;
        }

        .status-badge.inactive {
            background: #fee2e2;
            color: #991b1b;
        }

        .status-badge.paused {
            background: #fef3c7;
            color: #92400e;
        }

        /* Action Buttons */
        .service-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .action-btn {
            padding: 8px 16px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            background: white;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .action-btn:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
        }

        .action-btn.primary {
            background: #2563eb;
            color: white;
            border-color: #2563eb;
        }

        .action-btn.primary:hover {
            background: #1d4ed8;
        }

        .action-btn.danger {
            color: #dc2626;
        }

        .action-btn.danger:hover {
            background: #fee2e2;
            border-color: #fecaca;
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 12px;
            padding: 32px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .modal-title {
            font-size: 20px;
            font-weight: 600;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            color: #64748b;
            cursor: pointer;
        }

        .close-btn:hover {
            color: #1e293b;
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 64px 32px;
            background: white;
            border-radius: 12px;
        }

        .empty-state i {
            font-size: 64px;
            color: #cbd5e1;
            margin-bottom: 16px;
        }

        .empty-state h3 {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }

        .empty-state p {
            color: #64748b;
            margin-bottom: 24px;
        }

        /* Loading Skeleton */
        .skeleton {
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 8px;
        }

        @keyframes loading {
            0% {
                background-position: 200% 0;
            }

            100% {
                background-position: -200% 0;
            }
        }

        .skeleton-card {
            height: 250px;
            margin-bottom: 24px;
        }
    </style>
</head>

<body>
    <!-- Include navigation bar component -->
    @include('components.navbar', [
    'title' => 'My Services',
    'searchPlaceholder' => 'Search services...',
    'userInitials' => 'JD'
    ])

    @include('components.professional-sidebar')

    <!-- Main Content Area -->
    <main class="main-content">
        <!-- Page Header with Title and Add Button -->
        <div class="services-header">
            <div>
                <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">My Services</h1>
                <p style="color: #64748b;">Manage your service offerings and pricing</p>
            </div>
            <!-- Button to open Add Service Modal -->
            <button class="btn btn-primary" onclick="openAddServiceModal()">
                <i class="fas fa-plus"></i> Add New Service
            </button>
        </div>

        <!-- Statistics Cards Section -->
        <div class="services-stats">
            <!-- Total Services Count -->
            <div class="stat-card">
                <div class="stat-value" id="total-services">0</div>
                <div class="stat-label">Total Services</div>
            </div>
            <!-- Active Services Count -->
            <div class="stat-card">
                <div class="stat-value" id="active-services">0</div>
                <div class="stat-label">Active Services</div>
            </div>
            <!-- Total Bookings Count -->
            <div class="stat-card">
                <div class="stat-value" id="total-bookings">0</div>
                <div class="stat-label">Total Bookings</div>
            </div>
            <!-- Average Rating Display -->
            <div class="stat-card">
                <div class="stat-value" id="avg-rating">0.0</div>
                <div class="stat-label">Average Rating</div>
            </div>
        </div>

        <!-- Services Grid Container - Will be populated by JavaScript -->
        <div class="services-grid" id="services-container">
            <!-- Loading skeletons shown while fetching data -->
            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-card"></div>
        </div>
    </main>

    <!-- Add/Edit Service Modal -->
    <div class="modal" id="service-modal">
        <div class="modal-content">
            <!-- Modal Header with Title and Close Button -->
            <div class="modal-header">
                <h2 class="modal-title" id="modal-title">Add New Service</h2>
                <button class="close-btn" onclick="closeServiceModal()">&times;</button>
            </div>

            <!-- Service Form -->
            <form id="service-form" onsubmit="saveService(event)">
                <!-- Hidden field to store service ID for editing -->
                <input type="hidden" id="service-id">

                <!-- Service Name Input -->
                <div class="form-group">
                    <label class="form-label">Service Name *</label>
                    <input type="text" class="form-input" id="service-name" placeholder="e.g., Home Plumbing Repair" required>
                </div>

                <!-- Service Description Textarea -->
                <div class="form-group">
                    <label class="form-label">Description *</label>
                    <textarea class="form-textarea" id="service-description" placeholder="Describe your service in detail..." required></textarea>
                </div>

                <!-- Service Price Input -->
                <div class="form-group">
                    <label class="form-label">Price (₹) *</label>
                    <input type="number" class="form-input" id="service-price" placeholder="1500" min="0" step="1" required>
                </div>

                <!-- Service Category Dropdown -->
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-select" id="service-category">
                        <option value="plumbing">Plumbing</option>
                        <option value="electrical">Electrical</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="carpentry">Carpentry</option>
                        <option value="painting">Painting</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <!-- Service Duration Input -->
                <div class="form-group">
                    <label class="form-label">Estimated Duration (hours)</label>
                    <input type="number" class="form-input" id="service-duration" placeholder="2" min="0.5" step="0.5">
                </div>

                <!-- Form Action Buttons -->
                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <button type="submit" class="btn btn-primary" style="flex: 1;">
                        <i class="fas fa-save"></i> Save Service
                    </button>
                    <button type="button" class="btn btn-outline" onclick="closeServiceModal()">Cancel</button>
                </div>
            </form>
        </div>
    </div>


    <!-- Include profile modal component -->
    @include('components.profile-modal')

    <!-- Include common scripts component -->
    @include('components.scripts')

    <script>
        // Store current service ID being edited
        let currentServiceId = null;

        // Initialize page when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            loadServices(); // Fetch and display all services
        });

        // Fetch services from API - GET /api/professional/services
        async function loadServices() {
            try {
                // Make API call to get services list
                const response = await fetch(`${API_BASE}/professional/services`, {
                    method: 'GET',
                    headers: authHeaders
                });

                // Check if request was successful
                if (!response.ok) throw new Error('Failed to load services');

                // Parse JSON response
                const services = await response.json();

                // Update statistics cards with data
                updateStats(services);

                // Render service cards in the grid
                renderServices(services);
            } catch (error) {
                console.error('Error loading services:', error);
                showEmptyState('No services found. Add your first service to get started!');
            }
        }

        // Update statistics cards with calculated values
        function updateStats(services) {
            // Calculate total number of services
            document.getElementById('total-services').textContent = services.length;

            // Count active services (status === 'active')
            const activeCount = services.filter(s => s.status === 'active').length;
            document.getElementById('active-services').textContent = activeCount;

            // Sum total bookings across all services
            const totalBookings = services.reduce((sum, s) => sum + (s.bookings || 0), 0);
            document.getElementById('total-bookings').textContent = totalBookings;

            // Calculate average rating across all services
            const avgRating = services.length > 0 ?
                (services.reduce((sum, s) => sum + (s.rating || 0), 0) / services.length).toFixed(1) :
                '0.0';
            document.getElementById('avg-rating').textContent = avgRating;
        }

        // Render service cards in the grid
        function renderServices(services) {
            const container = document.getElementById('services-container');

            // Show empty state if no services exist
            if (services.length === 0) {
                showEmptyState('No services found. Add your first service to get started!');
                return;
            }

            // Generate HTML for each service card
            container.innerHTML = services.map(service => `
                <div class="service-card">
                    <!-- Service Header with Title and Status Badge -->
                    <div class="service-header">
                        <div style="flex: 1;">
                            <div class="service-title">${service.name}</div>
                            <span class="status-badge ${service.status || 'active'}">${service.status || 'Active'}</span>
                        </div>
                        <div class="service-price">₹${service.price}</div>
                    </div>
                    
                    <!-- Service Description -->
                    <div class="service-description">${service.description}</div>
                    
                    <!-- Service Metadata (bookings, rating, duration) -->
                    <div class="service-meta">
                        <div class="meta-item">
                            <i class="fas fa-calendar-check"></i>
                            <span>${service.bookings || 0} bookings</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-star"></i>
                            <span>${service.rating || 0} rating</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${service.duration || 'N/A'} hrs</span>
                        </div>
                    </div>
                    
                    <!-- Action Buttons for Service Management -->
                    <div class="service-actions">
                        <button class="action-btn primary" onclick="editService(${service.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn" onclick="toggleServiceStatus(${service.id}, '${service.status}')">
                            <i class="fas fa-${service.status === 'active' ? 'pause' : 'play'}"></i>
                            ${service.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                        <button class="action-btn danger" onclick="deleteService(${service.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Show empty state message when no services exist
        function showEmptyState(message) {
            const container = document.getElementById('services-container');
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-briefcase"></i>
                    <h3>No Services Yet</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="openAddServiceModal()">
                        <i class="fas fa-plus"></i> Add Your First Service
                    </button>
                </div>
            `;
        }

        // Open modal for adding a new service
        function openAddServiceModal() {
            currentServiceId = null; // Reset service ID
            document.getElementById('modal-title').textContent = 'Add New Service';
            document.getElementById('service-form').reset(); // Clear form fields
            document.getElementById('service-modal').classList.add('active'); // Show modal
        }

        // Close the service modal
        function closeServiceModal() {
            document.getElementById('service-modal').classList.remove('active');
        }

        // Save service (Add or Update) - POST /api/professional/services
        async function saveService(event) {
            event.preventDefault(); // Prevent form submission

            // Collect form data
            const serviceData = {
                name: document.getElementById('service-name').value,
                description: document.getElementById('service-description').value,
                price: parseFloat(document.getElementById('service-price').value),
                category: document.getElementById('service-category').value,
                duration: parseFloat(document.getElementById('service-duration').value) || null
            };

            try {
                // Determine if adding new or updating existing service
                const url = currentServiceId ?
                    `${API_BASE}/professional/services/${currentServiceId}` :
                    `${API_BASE}/professional/services`;

                const method = currentServiceId ? 'PUT' : 'POST';

                // Make API call to save service
                const response = await fetch(url, {
                    method: method,
                    headers: authHeaders,
                    body: JSON.stringify(serviceData)
                });

                // Check if save was successful
                if (!response.ok) throw new Error('Failed to save service');

                // Show success message
                alert(currentServiceId ? 'Service updated successfully!' : 'Service added successfully!');

                // Close modal and reload services
                closeServiceModal();
                loadServices();
            } catch (error) {
                console.error('Error saving service:', error);
                alert('Failed to save service. Please try again.');
            }
        }

        // Edit existing service - populate form with service data
        async function editService(serviceId) {
            try {
                // Fetch service details from API
                const response = await fetch(`${API_BASE}/professional/services/${serviceId}`, {
                    headers: authHeaders
                });

                if (!response.ok) throw new Error('Failed to load service details');

                const service = await response.json();

                // Populate form fields with service data
                currentServiceId = serviceId;
                document.getElementById('modal-title').textContent = 'Edit Service';
                document.getElementById('service-name').value = service.name;
                document.getElementById('service-description').value = service.description;
                document.getElementById('service-price').value = service.price;
                document.getElementById('service-category').value = service.category || 'other';
                document.getElementById('service-duration').value = service.duration || '';

                // Open modal
                document.getElementById('service-modal').classList.add('active');
            } catch (error) {
                console.error('Error loading service:', error);
                alert('Failed to load service details');
            }
        }

        // Toggle service status (active/paused) - PUT /api/professional/services/{id}
        async function toggleServiceStatus(serviceId, currentStatus) {
            // Determine new status
            const newStatus = currentStatus === 'active' ? 'paused' : 'active';

            try {
                // Make API call to update service status
                const response = await fetch(`${API_BASE}/professional/services/${serviceId}`, {
                    method: 'PUT',
                    headers: authHeaders,
                    body: JSON.stringify({
                        status: newStatus
                    })
                });

                if (!response.ok) throw new Error('Failed to update service status');

                // Show success message and reload services
                alert(`Service ${newStatus === 'active' ? 'activated' : 'paused'} successfully!`);
                loadServices();
            } catch (error) {
                console.error('Error updating service status:', error);
                alert('Failed to update service status');
            }
        }

        // Delete service - DELETE /api/professional/services/{id}
        async function deleteService(serviceId) {
            // Confirm deletion with user
            if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
                return;
            }

            try {
                // Make API call to delete service
                const response = await fetch(`${API_BASE}/professional/services/${serviceId}`, {
                    method: 'DELETE',
                    headers: authHeaders
                });

                if (!response.ok) throw new Error('Failed to delete service');

                // Show success message and reload services
                alert('Service deleted successfully!');
                loadServices();
            } catch (error) {
                console.error('Error deleting service:', error);
                alert('Failed to delete service');
            }
        }

        // Close modal when clicking outside of it
        document.getElementById('service-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeServiceModal();
            }
        });
    </script>
</body>

</html>