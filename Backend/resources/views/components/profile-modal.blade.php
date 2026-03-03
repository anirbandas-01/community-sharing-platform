<!-- Profile View Modal Component -->
<div class="modal" id="profile-view-modal" style="display: none;">
    <div class="modal-content" style="max-width: 700px; background: white; padding: 0; border-radius: 16px; overflow: hidden;">
        <!-- Modal Header -->
        <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 2rem; color: white; position: relative;">
            <button onclick="closeProfileModal()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-times"></i>
            </button>
            <div style="display: flex; align-items: center; gap: 1.5rem;">
                <div id="modal-profile-image" style="width: 80px; height: 80px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 600; color: #2563eb; background-size: cover; background-position: center;">
                    <i class="fas fa-user" style="color: #2563eb;"></i>
                </div>
                <div>
                    <h2 id="modal-profile-name" style="margin: 0; font-size: 24px;">Loading...</h2>
                    <p id="modal-profile-specialization" style="margin: 0.5rem 0 0 0; opacity: 0.9; font-size: 14px;">Professional</p>
                </div>
            </div>
        </div>

        <!-- Modal Body -->
        <div style="padding: 2rem;">
            <!-- Contact Information -->
            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-address-card" style="color: #2563eb;"></i>
                    Contact Information
                </h3>
                <div style="display: grid; gap: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #f8fafc; border-radius: 8px;">
                        <i class="fas fa-envelope" style="color: #64748b; width: 20px;"></i>
                        <div>
                            <div style="font-size: 12px; color: #64748b;">Email</div>
                            <div id="modal-profile-email" style="font-size: 14px; color: #1e293b; font-weight: 500;">-</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #f8fafc; border-radius: 8px;">
                        <i class="fas fa-phone" style="color: #64748b; width: 20px;"></i>
                        <div>
                            <div style="font-size: 12px; color: #64748b;">Phone</div>
                            <div id="modal-profile-phone" style="font-size: 14px; color: #1e293b; font-weight: 500;">-</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Professional Information -->
            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-briefcase" style="color: #2563eb;"></i>
                    Professional Details
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                    <div style="padding: 0.75rem; background: #f8fafc; border-radius: 8px;">
                        <div style="font-size: 12px; color: #64748b; margin-bottom: 0.25rem;">Experience</div>
                        <div id="modal-profile-experience" style="font-size: 16px; color: #1e293b; font-weight: 600;">-</div>
                    </div>
                    <div style="padding: 0.75rem; background: #f8fafc; border-radius: 8px;">
                        <div style="font-size: 12px; color: #64748b; margin-bottom: 0.25rem;">Hourly Rate</div>
                        <div id="modal-profile-rate" style="font-size: 16px; color: #1e293b; font-weight: 600;">-</div>
                    </div>
                </div>
            </div>

            <!-- Qualifications -->
            <div id="qualifications-section" style="margin-bottom: 2rem; display: none;">
                <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-certificate" style="color: #2563eb;"></i>
                    Qualifications
                </h3>
                <div id="modal-profile-qualifications" style="padding: 1rem; background: #f8fafc; border-radius: 8px; color: #475569; font-size: 14px; line-height: 1.6;">
                    -
                </div>
            </div>

            <!-- Bio -->
            <div id="bio-section" style="margin-bottom: 1rem; display: none;">
                <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-user-circle" style="color: #2563eb;"></i>
                    About
                </h3>
                <div id="modal-profile-bio" style="padding: 1rem; background: #f8fafc; border-radius: 8px; color: #475569; font-size: 14px; line-height: 1.6;">
                    -
                </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button onclick="openSettings()" class="btn btn-primary" style="flex: 1; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <i class="fas fa-edit"></i>
                    Edit Profile
                </button>
                <button onclick="closeProfileModal()" class="btn btn-outline" style="flex: 1; padding: 0.75rem; background: white; color: #64748b; border: 1px solid #e2e8f0; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Close
                </button>
            </div>
        </div>
    </div>
</div>