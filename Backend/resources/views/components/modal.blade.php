<div class="modal" id="{{ $id }}">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">{{ $title }}</h2>
            <button class="close-btn" onclick="closeModal('{{ $id }}')">&times;</button>
        </div>
        
        <div class="modal-body">
            {{ $slot }}
        </div>
    </div>
</div>