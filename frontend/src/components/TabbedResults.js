import React, { Component } from 'react';
import { Row, Col, Alert, Tabs, Tab, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ResultsTable from './ResultsTable';
import Loader from './Loader';
import './TabbedResults.less';

class TabbedResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 0,
      nTabs: 0
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextNTabs = nextProps.results.size;

    if (prevState.nTabs === nextNTabs) {
      return null;
    }

    // Make the last tab active when a new one is added,
    // or when the current active tab is deleted
    const newTab = prevState.nTabs < nextNTabs;
    const lostTab = !nextProps.results.has(prevState.activeKey);

    if (newTab || lostTab) {
      return {
        activeKey: Array.from(nextProps.results.keys())[nextNTabs - 1],
        nTabs: nextNTabs
      };
    }

    return { nTabs: nextNTabs };
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  render() {
    return (
      <Tabs
        id="tabbed-results"
        activeKey={this.state.activeKey}
        onSelect={this.handleSelect}
      >
        {Array.from(this.props.results.entries()).map(([key, query]) => {
          const title = (
            <div>
              <span className="tab-title">{query.sql}</span>
              <Button
                className="close"
                onClick={e => {
                  e.stopPropagation();
                  this.props.handleRemoveResult(key);
                }}
              >
                <span aria-hidden="true">&times;</span>
              </Button>
            </div>
          );

          let content = '';

          if (query.loading) {
            content = (
              <Row>
                <Col className="text-center loader-col" xs={12}>
                  <Loader />
                </Col>
              </Row>
            );
          } else if (query.errorMsg) {
            content = (
              <Row className="errors-row">
                <Col xs={12}>
                  <Alert bsStyle="danger">{query.errorMsg}</Alert>
                </Col>
              </Row>
            );
          } else {
            content = <ResultsTable response={query.response} />;
          }

          return (
            <Tab key={key} eventKey={key} title={title}>
              <Row className="query-row">
                <Col xs={12}>
                  <div className="query-text">
                    <p>{query.sql}</p>
                  </div>
                  <Button
                    className="edit-query"
                    bsStyle="link"
                    onClick={() => this.props.handleEditQuery(query.sql)}
                  >
                    edit query
                  </Button>
                </Col>
              </Row>
              {content}
            </Tab>
          );
        })}
      </Tabs>
    );
  }
}

TabbedResults.propTypes = {
  // results is a Map of objects, each object may contain:
  // sql: 'string'      Required
  // loading: true      Optional, tab will show a loading animation
  // errorMsg: 'string' Optional
  // response: object   Required if loading and errorMsg are not present
  results: PropTypes.instanceOf(Map).isRequired,
  handleRemoveResult: PropTypes.func.isRequired,
  handleEditQuery: PropTypes.func.isRequired
};

export default TabbedResults;
