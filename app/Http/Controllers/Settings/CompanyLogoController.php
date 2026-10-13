<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CompanyLogoController extends Controller
{
    public function edit(Request $request): Response
    {
        $logoPath = $request->user()->tenant->company_logo_path;

        return Inertia::render('settings/company', [
            'logoUrl' => $logoPath ? route('company.logo.image', absolute: false) : null,
        ]);
    }

    public function image(Request $request): \Illuminate\Http\Response
    {
        $disk = Storage::disk('public');
        $logoPath = $request->user()->tenant->company_logo_path;

        abort_unless($logoPath && $disk->exists($logoPath), 404);

        $mimeType = match (strtolower(pathinfo($logoPath, PATHINFO_EXTENSION))) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
            default => 'application/octet-stream',
        };

        return response($disk->get($logoPath), 200, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'private, max-age=3600',
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'logo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();
        $tenant = $user->tenant;
        $oldLogoPath = $tenant->company_logo_path;
        $tenant->company_logo_path = $validated['logo']->store('company-logos/'.$tenant->getKey(), 'public');
        $tenant->save();

        if ($oldLogoPath) {
            Storage::disk('public')->delete($oldLogoPath);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Logomarca atualizada.']);

        return to_route('company.edit');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        $tenant = $user->tenant;

        if ($tenant->company_logo_path) {
            Storage::disk('public')->delete($tenant->company_logo_path);
            $tenant->company_logo_path = null;
            $tenant->save();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Logomarca removida.']);

        return to_route('company.edit');
    }
}
