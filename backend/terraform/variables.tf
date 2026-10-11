variable "aws_region" {
    type = string
    default = "ap-south-2"
}

variable "project_name" {
    type = string
    default = "ai-reel-generator"
}

variable "gemini_api_key" {
    type = string
    sensitive = true
}

variable "groq_api_key" {
    type = string
    sensitive = true
}

variable "lambda_timeout" {
    description = "Maximum API lambda execution time in seconds"
    type = number
    default = 60
}

variable "lambda_memory_size" {
    description = "Memory allocated to each API lambda in MB"
    type = number
    default = 512
}