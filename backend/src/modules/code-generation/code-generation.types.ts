export interface CodeGenerationRequest {
    topic: string,
    language: "java" | "typescript" | "javascript" | "c++",
    requirements: string
}