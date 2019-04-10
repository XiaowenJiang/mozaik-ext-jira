import React, { Component, PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import reactMixin                      from 'react-mixin';
import { ListenerMixin }               from 'reflux';
import Mozaik                          from 'mozaik/browser';

class CurrentSprint extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sprint_info: {}
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
        this.setState({ sprint_info: data});
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
        const { sprint_info } = this.state;
        const remainDays = this.calcDays(sprint_info.endDate);
        return (
            <div>
                <div className="widget__header">
                    <span className="widget__header__subject">Jira Project: { project }</span>
                    <span className="widget__header__count">
                        { length }
                    </span>
                    <i className="fa fa-jira" aria-hidden="true" />
                </div>
                <div className="widget__body">
                    <span className="jira__sprint__remain">
                        { endDate }
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
