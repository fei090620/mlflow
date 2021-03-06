import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ExperimentListView from './ExperimentListView';
import ExperimentPage from './ExperimentPage';
import { getExperiments } from '../reducers/Reducers';
import NoExperimentView from './NoExperimentView';

export const getFirstActiveExperiment = (experiments) => {
  const sorted = experiments.concat().sort((a, b) => (a.experiment_id - b.experiment_id));
  return sorted.find((e) => e.lifecycle_stage === "active");
};

class HomeView extends Component {
  constructor(props) {
    super(props);
    this.onClickListExperiments = this.onClickListExperiments.bind(this);
  }

  static propTypes = {
    experimentId: PropTypes.number,
  };

  state = {
    listExperimentsExpanded: true,
  };

  onClickListExperiments() {
    this.setState({ listExperimentsExpanded: !this.state.listExperimentsExpanded });
  }

  render() {
    if (this.state.listExperimentsExpanded) {
      return (
        <div className="outer-container">
          <div className="HomePage-experiment-list-container">
            <div className="collapsed-expander-container">
              <ExperimentListView
                activeExperimentId={this.props.experimentId}
                onClickListExperiments={this.onClickListExperiments}
              />
            </div>
          </div>
          <div className="experiment-view-container">
            { this.props.experimentId !== undefined ?
             <ExperimentPage experimentId={this.props.experimentId}/> :
             <NoExperimentView/>
            }
          </div>
          <div className="experiment-view-right"/>
        </div>
      );
    } else {
      return (
        <div>
          <div className="collapsed-expander-container">
            <i onClick={this.onClickListExperiments}
               title="Show experiment list"
               className="expander fa fa-chevron-right login-icon"/>
          </div>
          <div className="experiment-page-container">
            { this.props.experimentId !== undefined ?
              <ExperimentPage experimentId={this.props.experimentId}/> :
              <NoExperimentView/>
            }
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  if (ownProps.experimentId === undefined) {
    const firstExp = getFirstActiveExperiment(getExperiments(state));
    if (firstExp) {
      return { experimentId: parseInt(firstExp.experiment_id, 10) };
    }
  }
  return {};
};

export default connect(mapStateToProps)(HomeView);
