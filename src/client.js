import request from 'superagent';
import Promise from 'bluebird';
import cache   from 'memory-cache';
import config  from './config';
import chalk   from 'chalk';
require('superagent-bluebird-promise');


/**
 * @param {Mozaik} mozaik
 */
const client = mozaik => {
    mozaik.loadApiConfig(config);

    function buildRequest(path) {
        const url = config.get('jira.baseUrl') + path;
        let req = request.get(url);

        mozaik.logger.info(chalk.yellow(`[jira] fetching from ${ url }`));

        return req
            .set({'Content-Type': 'application/json', 
            'Authorization': 'Basic ' + config.get('jira.basicAuthKey')})
            .promise()
            .catch(error => {
                mozaik.logger.error(chalk.red(`[jira] ${ error }`));
                throw error;
            })
        ;
    }

    const methods = {
        currentsprint(params) {
            return buildRequest(`/rest/agile/1.0/board/${ params.board_id }/sprint?state=active`)
                .then(res => {
                    let values = res.body.values;
                    const sprint_id = values[0].id;
                    const reqs = [];
                    values[0]["baseUrl"] = config.get('jira.baseUrl');
                    reqs.push(Promise.resolve(values));
                    reqs.push(buildRequest(`/rest/agile/1.0/board/${ params.board_id }/sprint/${sprint_id}/issue?fields=status`)
                        .then(res => res.body.issues));
                    return Promise.all(reqs).then(data => data);
                })
        }
    };

    return methods;
};


export default client;
