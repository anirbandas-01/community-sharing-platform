# LocalConnect Pro - Reusable Components Guide

## Overview

This directory contains reusable Blade components that can be used across all pages in the LocalConnect Pro application.

## Components Available

### 1. **navbar.blade.php**

Reusable navigation bar with notifications, messages, and profile dropdown.

**Usage:**

```blade
@include('components.navbar', [
    'title' => 'Your Page Title',
    'searchPlaceholder' => 'Search...',
    'userInitials' => 'JD'
])
```

**Props:**

- `title` (optional): Page title shown in logo section. Default: "LocalConnect Pro"
- `searchPlaceholder` (optional): Search input placeholder. Default: "Search..."
- `userInitials` (optional): User initials for avatar. Default: "JD"

---

### 2. **sidebar.blade.php**

Reusable sidebar navigation menu.

**Usage:**

```blade
@include('components.sidebar', [
    'menuItems' => [
        ['icon' => 'th-large', 'label' => 'Dashboard', 'route' => 'dashboard', 'active' => true],
        ['icon' => 'cog', 'label' => 'Settings', 'route' => 'settings', 'active' => false]
    ]
])
```

**Props:**

- `menuItems` (required): Array of menu items with:
    - `icon`: Font Awesome icon name (without 'fa-' prefix)
    - `label`: Menu item label
    - `route`: Route name for navigation
    - `active`: Boolean to mark current page

---

### 3. **styles.blade.php**

Common CSS styles for all pages.

**Usage:**

```blade
@include('components.styles')
```

**Includes:**

- Navigation bar styles
- Sidebar styles
- Form elements (inputs, selects, textareas)
- Buttons (primary, secondary, outline, danger)
- Notification panel styles
- Responsive design breakpoints
- Common utility classes

---

### 4. **scripts.blade.php**

Common JavaScript functions for all pages.

**Usage:**

```blade
@include('components.scripts')
```

**Includes:**

- API configuration
- Authentication headers
- Sidebar toggle
- Dropdown toggle
- Notification panel functions
- Logout function
- Click-outside handlers

---

## Example: Creating a New Page

Here's how to create a new page using the components:

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page - LocalConnect Pro</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    @include('components.styles')
</head>
<body>
    @include('components.navbar', [
        'title' => 'My Custom Page',
        'searchPlaceholder' => 'Search items...'
    ])

    @include('components.sidebar', [
        'menuItems' => [
            ['icon' => 'th-large', 'label' => 'Dashboard', 'route' => 'dashboard', 'active' => false],
            ['icon' => 'briefcase', 'label' => 'Services', 'route' => 'services', 'active' => true],
            ['icon' => 'cog', 'label' => 'Settings', 'route' => 'settings', 'active' => false]
        ]
    ])

    <main class="main-content">
        <h1>My Page Content</h1>
        <div class="section">
            <!-- Your content here -->
        </div>
    </main>

    @include('components.scripts')

    <script>
        // Your custom JavaScript here
    </script>
</body>
</html>
```

---

## Settings Page

The `settings.blade.php` page demonstrates full usage of all components.

**Features:**

- ✅ 5 Tabbed Sections (Profile, Account, Notifications, Privacy, Preferences)
- ✅ Profile photo upload
- ✅ Form inputs for all settings
- ✅ Toggle switches for preferences
- ✅ Password change functionality
- ✅ Account deletion (danger zone)
- ✅ Fully responsive design
- ✅ Integrated with API routes

**Tabs:**

1. **Profile**: Name, email, phone, bio, location, avatar upload
2. **Account**: Password change, account deletion
3. **Notifications**: Email, push, appointment reminders, reviews, payments
4. **Privacy**: Profile visibility, online status, 2FA, data sharing
5. **Preferences**: Language, timezone, currency, date format

---

## API Integration

All components use the common API configuration:

```javascript
const API_BASE = "/api";
const token = localStorage.getItem("auth_token");

const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
};
```

**Settings Page API Calls:**

- `PUT /api/professional/profile` - Update profile
- `POST /api/user/change-password` - Change password
- `POST /api/user/profile/photo` - Upload profile photo
- `POST /api/logout` - Logout

---

## CSS Classes Reference

### Layout

- `.main-content` - Main content area with proper margins
- `.section` - White card container with shadow
- `.section-header` - Section header with title
- `.section-title` - Section title text

### Forms

- `.form-group` - Form field container
- `.form-label` - Form field label
- `.form-input` - Text input field
- `.form-select` - Select dropdown
- `.form-textarea` - Textarea field

### Buttons

- `.btn` - Base button class
- `.btn-primary` - Blue primary button
- `.btn-secondary` - Gray secondary button
- `.btn-outline` - Outlined button
- `.btn-danger` - Red danger button

### Toggles

- `.toggle-switch` - Toggle switch container
- `.toggle-switch.active` - Active state
- `.toggle-slider` - Toggle slider element

---

## Responsive Design

All components are fully responsive:

**Mobile (≤768px):**

- Sidebar hidden by default (toggle with hamburger)
- Search bar hidden
- Logo text hidden
- Single column layouts
- Full-width sections

**Tablet (769-1024px):**

- Sidebar visible
- 2-column grids
- Optimized spacing

**Desktop (≥1025px):**

- Full layout
- Multi-column grids
- Maximum usability

---

## Customization

### Adding Custom Styles

Add page-specific styles after including the common styles:

```blade
@include('components.styles')

<style>
    /* Your custom styles here */
    .my-custom-class {
        /* ... */
    }
</style>
```

### Adding Custom Scripts

Add page-specific scripts after including the common scripts:

```blade
@include('components.scripts')

<script>
    // Your custom JavaScript here
    function myCustomFunction() {
        // ...
    }
</script>
```

---

## Best Practices

1. **Always include components in this order:**
    - Styles in `<head>`
    - Navbar after `<body>`
    - Sidebar after navbar
    - Main content after sidebar
    - Scripts before `</body>`

2. **Use semantic HTML:**
    - Use `<main>` for main content
    - Use `<section>` for sections
    - Use proper heading hierarchy

3. **Maintain consistency:**
    - Use the same menu items across pages
    - Keep the same navigation structure
    - Use consistent spacing and colors

4. **API Integration:**
    - Always check for auth token
    - Handle errors gracefully
    - Show loading states
    - Provide user feedback

---

## File Structure

```
resources/views/
├── components/
│   ├── navbar.blade.php      # Navigation bar
│   ├── sidebar.blade.php     # Sidebar menu
│   ├── styles.blade.php      # Common CSS
│   └── scripts.blade.php     # Common JS
├── settings.blade.php         # Settings page (example)
├── professional.blade.php     # Dashboard page
└── ... (other pages)
```

---

## Future Enhancements

Potential components to add:

- `footer.blade.php` - Common footer
- `breadcrumb.blade.php` - Breadcrumb navigation
- `modal.blade.php` - Reusable modal dialog
- `toast.blade.php` - Toast notifications
- `table.blade.php` - Data table component
- `card.blade.php` - Card component
- `stats-card.blade.php` - Statistics card

---

## Support

For issues or questions about components:

1. Check this README
2. Review the settings.blade.php example
3. Contact the development team

---

**Happy Coding! 🚀**
