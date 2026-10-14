<?php

namespace App\Services;

use App\Models\Tenant;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CompanyLogoService
{
    public function url(Tenant $tenant): ?string
    {
        $logoPath = $tenant->company_logo_path;

        return $logoPath
            ? route('company.logo.image', ['v' => hash('sha256', $logoPath)], absolute: false)
            : null;
    }

    /**
     * @return array{content: string, mimeType: string}|null
     */
    public function image(Tenant $tenant): ?array
    {
        $disk = Storage::disk('public');
        $logoPath = $tenant->company_logo_path;

        if (! $logoPath || ! $disk->exists($logoPath)) {
            return null;
        }

        return [
            'content' => $disk->get($logoPath),
            'mimeType' => match (strtolower(pathinfo($logoPath, PATHINFO_EXTENSION))) {
                'jpg', 'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'webp' => 'image/webp',
                default => 'application/octet-stream',
            },
        ];
    }

    public function update(Tenant $tenant, UploadedFile $logo): void
    {
        $oldLogoPath = $tenant->company_logo_path;
        $tenant->company_logo_path = $logo->store('company-logos/'.$tenant->getKey(), 'public');
        $tenant->save();

        if ($oldLogoPath) {
            Storage::disk('public')->delete($oldLogoPath);
        }
    }

    public function delete(Tenant $tenant): void
    {
        if ($tenant->company_logo_path) {
            Storage::disk('public')->delete($tenant->company_logo_path);
            $tenant->company_logo_path = null;
            $tenant->save();
        }
    }
}
