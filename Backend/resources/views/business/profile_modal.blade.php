@php
    use Illuminate\Support\Facades\Auth;
    $user = Auth::user();
@endphp

@if($user)

<style>
/* ===== Profile Modal Styles ===== */

    .profile-avatar-large {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    background: #ffffff;
    border: 5px solid #ffffff;
    position: absolute;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .profile-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    #profileToggle:checked ~ .profile-modal-overlay {
        display: flex;
    }
    #profileToggle { display: none; }

    .profile-modal-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 2rem;
        overflow-y: auto;
    }

    .profile-modal-content {
        background: white;
        border-radius: 24px;
        width: 100%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .profile-modal-header {
        position: relative;
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        padding: 3rem 2rem 8rem;
        border-radius: 24px 24px 0 0;
        text-align: center;
    }

    .profile-close-btn {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        background: rgba(255,255,255,0.2);
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        color: white;
    }

    .profile-avatar-large {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: white;
        border: 5px solid white;
        position: absolute;
        bottom: -60px;
        left: 50%;
        transform: translateX(-50%);
        overflow: hidden;
    }

    .profile-avatar-large img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .profile-modal-body {
        padding: 5rem 2rem 2rem;
    }

    .profile-user-name {
        text-align: center;
        font-size: 1.75rem;
        font-weight: 900;
        color: #0f172a;
    }

    .profile-user-role {
        text-align: center;
        color: #64748b;
        font-weight: 600;
        margin-bottom: 2rem;
    }

    .profile-details {
        background: #f8fafc;
        border-radius: 16px;
        padding: 1.5rem;
    }

    .profile-detail-item {
        display: flex;
        padding: 0.75rem 0;
        border-bottom: 1px solid #e2e8f0;
    }

    .profile-detail-item:last-child { border-bottom: none; }

    .profile-detail-label {
        width: 140px;
        font-weight: 700;
        color: #475569;
    }

    .profile-detail-value {
        font-weight: 600;
        color: #0f172a;
    }

    .profile-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 2rem;
    }

    .profile-action-btn {
        padding: 1rem;
        border-radius: 12px;
        font-weight: 700;
        border: none;
        cursor: pointer;
        text-align: center;
    }

    .profile-btn-edit {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: white;
    }

    .profile-btn-logout {
        background: white;
        color: #ef4444;
        border: 2px solid #fecaca;
    }
    @media (max-width: 640px) {
    .profile-avatar-large {
        width: 100px;
        height: 100px;
        bottom: -50px;
    }
    }

    
</style>

<!-- Toggle -->
<input type="checkbox" id="profileToggle">

<!-- Modal -->
<div class="profile-modal-overlay">
    <div class="profile-modal-content">

        <div class="profile-modal-header">
            <label for="profileToggle" class="profile-close-btn">✕</label>

            <div class="profile-avatar-large">
                <img 
                    src="{{ asset('uploads/profiles/' . $user->profile_image) }}"
                    alt="Profile"
                    class="profile-avatar-img"
                >
            </div>
        </div>

        <div class="profile-modal-body">
            <h2 class="profile-user-name">{{ $user->name }}</h2>
            <p class="profile-user-role">{{ ucfirst($user->user_type) }} Account</p>

            <div class="profile-details">
                <div class="profile-detail-item">
                    <span class="profile-detail-label">Email</span>
                    <span class="profile-detail-value">{{ $user->email }}</span>
                </div>

                <div class="profile-detail-item">
                    <span class="profile-detail-label">Phone</span>
                    <span class="profile-detail-value">{{ $user->phone }}</span>
                </div>

                <div class="profile-detail-item">
                    <span class="profile-detail-label">City</span>
                    <span class="profile-detail-value">{{ $user->city }}</span>
                </div>

                <div class="profile-detail-item">
                    <span class="profile-detail-label">Aadhaar</span>
                    <span class="profile-detail-value">
                        XXXX-XXXX-{{ substr($user->aadhaar, -4) }}
                    </span>
                </div>

                <div class="profile-detail-item">
                    <span class="profile-detail-label">Member Since</span>
                    <span class="profile-detail-value">
                        {{ $user->created_at->format('F Y') }}
                    </span>
                </div>
            </div>

            <div class="profile-actions">
                <a href="/profile/edit" class="profile-action-btn profile-btn-edit">
                    ✏️ Edit Profile
                </a>

                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="profile-action-btn profile-btn-logout">
                        🚪 Logout
                    </button>
                </form>
            </div>
        </div>

    </div>
</div>

@endif
