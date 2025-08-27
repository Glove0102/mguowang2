#!/bin/bash

# ----------------------------------
# CONFIGURE YOUR PROJECT ID HERE
# ----------------------------------
PROJECT_ID="381739776330"
# ----------------------------------


# Check if a prompt was provided
if [ -z "$1" ]; then
  echo "Usage: ./gemini.sh \"Your question here\""
  exit 1
fi

PROMPT="$1"

# The curl command to call the Gemini API
curl \
  -s \
  -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  "https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent" -d @- <<EOF
{
  "contents": [
    {
      "parts": [
        { "text": "${PROMPT}" }
      ]
    }
  ]
}
EOF