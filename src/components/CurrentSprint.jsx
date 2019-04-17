import React, { Component, PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import reactMixin                      from 'react-mixin';
import { ListenerMixin }               from 'reflux';
import Mozaik                          from 'mozaik/browser';
import chalk                           from 'chalk';

class CurrentSprint extends Component {
    constructor(props) {
        super(props);

        this.state = {
            info: []
        };
    }

    getApiRequest() {
        const { project, board_id } = this.props;
        const params = {
            project,
            board_id
        };

        return { id: `jira.currentsprint`,
                 params: params
        };
    }

    onApiData(info) {
        this.setState({ info });
    }

    calcDays(date) {
        const currentDate = new Date();
        const endDate = new Date(date);
        const timeDiff = endDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays < 0 ? 0 : diffDays;
    }

    calcIssuesByStatus(issues) {
        let statusGroup = {};
        statusGroup["undefined"] = 0;
        statusGroup["toDo"] = 0;
        statusGroup["inProgress"] = 0;
        statusGroup["done"] = 0;
        issues.forEach(issue => {
            switch (issue.fields.status.statusCategory.id) {
                case 1:
                    statusGroup["undefined"]++;
                    break;
                case 2:
                    statusGroup["toDo"]++;
                    break;
                case 3:
                    statusGroup["done"]++;
                    break;
                case 4:
                    statusGroup["inProgress"]++;
                    break;
                default:
                    break;
            }
        });
        return statusGroup;
    }

    render() {
        const { project, board_id } = this.props;
        const { info } = this.state;
        console.log('render');
        var sprintNode = (
            <div className="widget__body">
            <span className="jira__sprint__loading">Loading...</span>
            </div>
        );
        if (info && info.length == 2) {
            const endDate = info[0][0].endDate;
            const sprintName = info[0][0].name;
            const sprintId = info[0][0].id;
            const sprintLink = info[0][0].baseUrl + "/secure/RapidBoard.jspa?rapidView=" + board_id + "&sprint=" + sprintId;
            const issues = info[1];
            const remainDays = this.calcDays(endDate);
            const statusGroup = this.calcIssuesByStatus(issues);
            sprintNode = (
                <div className="widget__body">
                    <div className="jira__sprint__title">
                        <span className="jira__sprint__title__description">
                            Sprint Remaining Days:
                        </span>
                        <span className="jira__sprint__title__name">
                            { sprintName }
                        </span>
                    </div>
                    <div className="jira__sprint__remain">
                        <a href={sprintLink} className="jira__sprint__remain__text-circle">
                            { remainDays }
                        </a>
                    </div>
                    <div className="jira__sprint__issue">
                        <span className="jira__sprint__issue__text">Undefined:</span>
                        <span className="jira__sprint__issue__undefined jira__sprint__issue__status">{ statusGroup["undefined"] }</span>
                        <span className="jira__sprint__issue__text">toDo:</span>
                        <span className="jira__sprint__issue__todo jira__sprint__issue__status">{ statusGroup["toDo"] }</span>
                        <span className="jira__sprint__issue__text">inProgress:</span>
                        <span className="jira__sprint__issue__inprogress jira__sprint__issue__status">{ statusGroup["inProgress"] }</span>
                        <span className="jira__sprint__issue__text">Done:</span>
                        <span className="jira__sprint__issue__done jira__sprint__issue__status">{ statusGroup["done"] }</span>
                    </div>
                </div>
            );
        }       
        return (
            <div>
                <div className="widget__header">
                    <span className="widget__header__subject">Jira Project: { project }</span>
                    <i className="fa fa-tasks" aria-hidden="true"/>
                </div>
                { sprintNode }
            </div>
        );
    }
}

CurrentSprint.displayName = 'CurrentSprint';

CurrentSprint.propTypes = {
    project: PropTypes.string.isRequired,
    board_id: PropTypes.number.isRequired
};

reactMixin(CurrentSprint.prototype, ListenerMixin);
reactMixin(CurrentSprint.prototype, Mozaik.Mixin.ApiConsumer);


export default CurrentSprint;
