import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';
import './SampleQueries.less';

const queries = [
  {
    name: 'load all java files',
    sql: 'select * from files where lang="java"'
  },
  {
    name: 'get uast from code',
    sql: 'select uast from code'
  },
  {
    name: 'top 50 repositories by something very long string',
    sql: 'select * from repositories limit 50'
  }
];

function SampleQueries({ onExampleClick }) {
  return (
    <div className="sample-queries">
      <div className="title">Sample Queries</div>
      <div className="list">
        {queries.map((q, i) => (
          <div
            key={i}
            className="query"
            title={q.name}
            onClick={() => onExampleClick(q.sql)}
          >
            <Glyphicon glyph="list" />
            {q.name}
          </div>
        ))}
      </div>
    </div>
  );
}

SampleQueries.propTypes = {
  onExampleClick: PropTypes.func
};

export default SampleQueries;
