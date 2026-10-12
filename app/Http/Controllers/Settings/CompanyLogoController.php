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
        $logoPath = $request->user()->company_logo_path;

        return Inertia::render('settings/company', [
            'logoUrl' => $logoPath ? Storage::disk('public')->url($logoPath) : null,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'logo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();
        $oldLogoPath = $user->company_logo_path;
        $user->company_logo_path = $validated['logo']->store('company-logos/'.$user->getKey(), 'public');
        $user->save();

        if ($oldLogoPath) {
            Storage::disk('public')->delete($oldLogoPath);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Logomarca atualizada.']);

        return to_route('company.edit');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->company_logo_path) {
            Storage::disk('public')->delete($user->company_logo_path);
            $user->company_logo_path = null;
            $user->save();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Logomarca removida.']);

        return to_route('company.edit');
    }
}
