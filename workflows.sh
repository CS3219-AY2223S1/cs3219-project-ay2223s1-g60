# read the workflow template
WORKFLOW_TEMPLATE=$(cat .github/workflow-template.yaml)

# iterate each route in routes directory
for SERVICE in $(ls backend); do
    echo "generating workflow for backend/${SERVICE}"

    # replace template route placeholder with route name
    WORKFLOW=$(echo "${WORKFLOW_TEMPLATE}" | sed "s/{{SERVICE}}/${SERVICE}/g")

    # save workflow to .github/workflows/{SERVICE}
    echo "${WORKFLOW}" > .github/workflows/${SERVICE}.yaml
done
