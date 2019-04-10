import React, { Component, PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import reactMixin                      from 'react-mixin';
import { ListenerMixin }               from 'reflux';
import Mozaik                          from 'mozaik/browser';
import chalk                           from 'chalk';

class CurrentSprint extends Component {
    constructor(props) {
        super(props);

        this.state = {
            info: {}
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

    onApiData(data) {
        console.log(data);
        this.setState({ info: data});
    }

    calcDays(date) {
        const currentDate = new Date();
        const endDate = new Date(date);
        const timeDiff = endDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays < 0 ? 0 : diffDays;
    }

    render() {
        const { project, board_id } = this.props;
        const { info } = this.state;
        console.log('render');
        if (!info || !("sprint_info" in info) || !("issues" in info)) {
            return (
                <div>Loading...</div>
            );
        }       
        const endDate = info["sprint_info"][0].endDate;
        const issues = info["issues"];
        const remainDays = this.calcDays(endDate);
        return (
            <div>
                <div className="widget__header">
                    <span className="widget__header__subject">Jira Project: { project }</span>
                    <i className="fab fa-jira"/>
                </div>
                <div className="widget__body">
                    <span className="jira__sprint__remain">
                        { remainDays }
                    </span>
                </div>
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
