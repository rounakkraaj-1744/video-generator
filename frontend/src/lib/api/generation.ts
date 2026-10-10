import type {
  ApiError,
  GenerationRequest,
  GenerationResult,
  VideoProject,
} from "../types/video-project";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export async function generateProject(
  request: GenerationRequest,
  signal?: AbortSignal
): Promise<VideoProject> {
  if (!apiUrl)
    throw {
      message: "No API URL configured. Enable development mock mode to preview the workspace.",
    } satisfies ApiError;
  let response: Response;
  try {
    response = await fetch(`${apiUrl}/generation`, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    throw { message: "The generation service could not be reached." } satisfies ApiError;
  }
  let data: GenerationResult | { error?: string; message?: string };
  try {
    data = await response.json();
  } catch {
    throw {
      message: "The generation service returned invalid JSON.",
      status: response.status,
    } satisfies ApiError;
  }
  if (!response.ok)
    throw {
      message:
        (data as { error?: string; message?: string }).message ??
        (data as { error?: string }).error ??
        "Generation failed.",
      status: response.status,
      details: data,
    } satisfies ApiError;
  const project = ("project" in data ? data.project : data) as Partial<VideoProject>;
  if (!project || !Array.isArray(project.scenes))
    throw { message: "The service returned an incomplete video project." } satisfies ApiError;
  return project as VideoProject;
}
