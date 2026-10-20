locals {
    name_prefix = var.project_name

    log_restoration_days = 7
    log_retention_days = 14

    # common_tags = {
    #     Project = var.project_name
    #     Managed_By = "Terraform"
    # }
}