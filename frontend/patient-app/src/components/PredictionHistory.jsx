import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Table, Alert, Button } from 'react-bootstrap';

const GET_PREDICTIONS = gql`
  query GetSymptomChecklists($patientId: ID!) {
    getSymptomChecklists(patientId: $patientId) {
      id
      submissionDate
      symptoms
      prediction {
        predictedConditions
        recommendConsultation
      }
    }
  }
`;

const DELETE_CHECKLIST = gql`
  mutation DeleteSymptomChecklist($id: ID!) {
    deleteSymptomChecklist(id: $id)
  }
`;

function PredictionHistory({ patientId }) {
  const { data, loading, error, refetch } = useQuery(GET_PREDICTIONS, {
    variables: { patientId },
  });

  const [deleteChecklist, { loading: deleting }] = useMutation(DELETE_CHECKLIST, {
    onCompleted: () => refetch(),
  });

  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this prediction entry?');
    if (confirmed) {
      deleteChecklist({ variables: { id } });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Prediction fetch error:', error);
    return <p>Error loading predictions</p>;
  }

  return (
    <div className="mt-4">
      <h4>Prediction History</h4>

      {data.getSymptomChecklists.length === 0 ? (
        <Alert variant="info">No predictions yet.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Symptoms</th>
              <th>Predicted Conditions</th>
              <th>Consult?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.getSymptomChecklists.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.submissionDate).toLocaleString()}</td>
                <td>{entry.symptoms.join(', ')}</td>
                <td>{entry.prediction?.predictedConditions?.join(', ') || '—'}</td>
                <td>{entry.prediction?.recommendConsultation ? 'Yes' : 'No'}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default PredictionHistory;
