@props([
    'title',
    'value',
    'icon',
    'iconColor' => 'blue',
    'change' => null
])


<div class="stat-card">
    <div class="stat-header">
        <div>
            <div class="stat-label">{{ $title }}</div>
            <div class="stat-value">{{ $value }}</div>
            @if(isset($change))
                <div class="stat-change {{ $change >= 0 ? 'positive' : 'negative' }}">
                    <i class="fas fa-arrow-{{ $change >= 0 ? 'up' : 'down' }}"></i>
                    <span>{{ abs($change) }}% vs last month</span>
                </div>
            @endif
        </div>
        <div class="stat-icon {{ $iconColor ?? 'blue' }}">
            <i class="fas fa-{{ $icon }}"></i>
        </div>
    </div>
</div>