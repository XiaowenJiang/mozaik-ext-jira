import convict from 'convict';


const config = convict({
    jira: {
        baseUrl: {
            doc:     'The jira API base url.',
            default: null,
            format:  String,
            env:     'JIRA_API_BASE_URL'
        },
        basicAuthKey: {
            doc:     'The jira API basic http auth password.',
            default: null,
            format:  String,
            env:     'JIRA_API_BASIC_AUTH_KEY'
        }
    }
});


export default config;
