<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Services\CompanyLogoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyLogoController extends Controller
{
    public function __construct(private readonly CompanyLogoService $companyLogoService) {}

    public function edit(Request $request): Response
    {
        return Inertia::render('settings/company', [
            'logoUrl' => $this->companyLogoService->url($request->user()->tenant),
        ]);
    }

    public function image(Request $request): \Illuminate\Http\Response
    {
        $image = $this->companyLogoService->image($request->user()->tenant);
        abort_unless($image, 404);

        return response($image['content'], 200, [
            'Content-Type' => $image['mimeType'],
            'Cache-Control' => 'private, no-store',
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'logo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $this->companyLogoService->update($request->user()->tenant, $validated['logo']);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Logomarca atualizada.']);

        return to_route('company.edit');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $this->companyLogoService->delete($request->user()->tenant);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Logomarca removida.']);

        return to_route('company.edit');
    }
}
