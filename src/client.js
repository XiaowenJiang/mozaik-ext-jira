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
            let info = {};
            info['sprint_info'] = buildRequest(`/rest/agile/1.0/board/${ params.board_id }/sprint?state=active`)
                .then(res => res.body.values);
            const sprint_id = sprint_info[0].id;
            info['issues'] = buildRequest(`/rest/agile/1.0/board/1952/sprint/${sprint_id}/issue`)
                .then(res => res.body.issues);
            return info;
        }
    };

    return methods;
};


export default client;
