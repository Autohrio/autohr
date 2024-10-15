
## DB Structure

```mermaid
erDiagram
    USER ||--o{ WORKSPACE : creates
    USER ||--|| SETTINGS : has
    USER {
        string name
        string email
    }
    WORKSPACE ||--o{ TEAM : has
    WORKSPACE ||--o{ ONBOARDING : has
    WORKSPACE ||--o{ POLICY : has
    WORKSPACE ||--o{ COMPLIANCE : has
    WORKSPACE ||--o{ MEETING : has
    WORKSPACE ||--o{ EMAIL : has
    WORKSPACE ||--o{ API_KEY : has
    WORKSPACE ||--|| BILLING : has
    WORKSPACE ||--o{ EMPLOYEE_FEEDBACK : stores
    WORKSPACE ||--o{ COMPANY_FEEDBACK : stores
    WORKSPACE {
        string name
        string owner_email
    }
    TEAM ||--o{ TEAM_MEMBER : contains
    TEAM {
        string name
    }
    TEAM_MEMBER {
        string name
        enum role
        string occupation
        string email
    }
    ONBOARDING ||--o{ CANDIDATE : has
    CANDIDATE {
        string name
        string occupation
        string email
        string interview_status
    }
    POLICY {
        text content
    }
    COMPLIANCE {
        text content
    }
    MEETING {
        string sync_source
    }
    EMAIL {
        object smtp_config
        object templates
    }
    EMAIL_SMTP_CONFIG {
        string host
        string port
        string username
        string password
        string fromEmail
    }
    EMAIL_TEMPLATES {
        string offer_template
        string rejection_template
    }
    API_KEY {
        datetime created_at
        string api_key
        string name
    }
    BILLING {
        string plan
    }
    SETTINGS ||--|| ACCOUNT : has
    SETTINGS ||--|| PROFILE : has
    ACCOUNT {
        string name
        date birth_date
        string language
    }
    PROFILE {
        string username
        string email
        text bio
        string[] urls
    }
    FEEDBACK_EMAIL {
        object smtp_config
    }
    EMAIL ||--|| EMAIL_SMTP_CONFIG : has
    EMAIL ||--|| EMAIL_TEMPLATES : has
    FEEDBACK_EMAIL ||--|| EMAIL_SMTP_CONFIG : has
    EMPLOYEE_FEEDBACK {
        string from_employee
        string to_employee
        text feedback
        datetime created_at
    }
    COMPANY_FEEDBACK {
        string from_employee
        text feedback
        datetime created_at
    }
    TEAM_MEMBER ||--o{ EMPLOYEE_FEEDBACK : gives
    TEAM_MEMBER ||--o{ COMPANY_FEEDBACK : gives
```