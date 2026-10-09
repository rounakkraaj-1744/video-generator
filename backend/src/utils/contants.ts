export class Constants {
    prompt = `
            You are an expert technical video director and software educator.

            Create an engaging, technically accurate educational video for Instagram Reels and YouTube Shorts.

            TOPIC: <TOPIC>

            TARGET DURATION: <DURATION> seconds

            OUTPUT REQUIREMENTS:
            - Return valid JSON only. No Markdown or code fences.
            - Follow the exact schema specified below.
            - Do not omit required fields.
            - Do not invent unsupported scene types.
            - Use concise, natural narration suitable for spoken delivery.
            - Explain concepts progressively, using examples where appropriate.
            - Prioritize technical accuracy over flashy visuals.
            - Keep the video within the target duration.

            VIDEO PROJECT STRUCTURE:
            {
            "version": 1,
            "title": "Video title",
            "duration": <DURATION>,
            "fps": 30,
            "width": 1080,
            "height": 1920,
            "scenes": []
            }

            SUPPORTED SCENE TYPES:

            1. hook
            Required fields:
            {
            "id": "hook",
            "type": "hook",
            "start": 0,
            "duration": 5,
            "narration": "Spoken narration",
            "title": "Short attention-grabbing headline"
            }

            2. text
            Required fields:
            {
            "id": "explanation",
            "type": "text",
            "start": 5,
            "duration": 8,
            "narration": "Spoken narration",
            "text": "Concise text displayed on screen"
            }

            3. code
            Required fields:
            {
            "id": "code-example",
            "type": "code",
            "start": 13,
            "duration": 10,
            "narration": "Explain the code",
            "language": "java",
            "code": "class Example {}",
            "highlightedLines": [1]
            }

            Supported languages:
            typescript, javascript, java, python, sql, bash.

            highlightedLines is optional. When provided, it must contain
            positive integer line numbers that exist in the code.

            4. diagram
            Required fields:
            {
            "id": "architecture",
            "type": "diagram",
            "start": 23,
            "duration": 10,
            "narration": "Explain the relationship",
            "nodes": [
                {
                "id": "component-a",
                "label": "Component A"
                },
                {
                "id": "component-b",
                "label": "Component B"
                }
            ],
            "edges": [
                {
                "from": "component-a",
                "to": "component-b",
                "label": "relationship"
                }
            ]
            }

            Diagram rules:
            - Every node must have an id and label.
            - Every edge must have from and to.
            - Edge endpoints must reference existing node IDs.
            - The diagram must represent the concept accurately.

            GLOBAL SCENE RULES:
            - Every scene must contain id, type, start, duration, and narration.
            - Scene IDs must be unique.
            - start must be a non-negative number representing seconds.
            - duration must be a positive number representing seconds.
            - Scenes must be arranged chronologically.
            - Scenes must not overlap.
            - No scene may end after the target video duration.
            - Use only the four supported scene types.
            - Every scene must include all fields required by its type.
            - Use JSON numbers, not numeric strings.
            - Use double quotes for JSON keys and string values.
            - Do not include comments or trailing commas.

            CONTENT GUIDELINES:
            - Start with a compelling hook.
            - Explain the core concept clearly.
            - Include code or diagrams when they improve understanding.
            - Use on-screen text sparingly.
            - Finish with a concise takeaway.
            - Ensure the narration across all scenes fits the target duration.
            - Avoid repeating the same explanation across scenes.

            Before returning the JSON, verify that every scene conforms
            to the required structure and that all timestamps are valid.

            Return the complete VideoProject JSON now.
        `;
}