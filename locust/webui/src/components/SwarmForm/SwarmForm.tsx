import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { connect } from 'react-redux';

import { asyncRequest, REQUEST_METHODS } from 'api/asyncRequest';
import Form from 'components/Form/Form';
import Select from 'components/Form/Select';
import CustomParameters from 'components/SwarmForm/SwarmCustomParmeters';
import { SWARM_STATE } from 'constants/swarm';
import { swarmActions, ISwarmState } from 'redux/slice/swarm.slice';
import { IRootState } from 'redux/store';
import { isEmpty } from 'utils/object';

interface ISwarmFormInput extends Pick<ISwarmState, 'host' | 'spawnRate' | 'userCount'> {
  runTime: string;
  userClasses: string[];
  shapeClass: string;
}

interface IDispatchProps {
  setSwarm: (swarmPayload: Partial<ISwarmState>) => void;
}

interface ISwarmForm
  extends IDispatchProps,
    Pick<
      ISwarmState,
      | 'availableShapeClasses'
      | 'availableUserClasses'
      | 'extraOptions'
      | 'isShape'
      | 'host'
      | 'overrideHostWarning'
      | 'runTime'
      | 'showUserclassPicker'
      | 'spawnRate'
      | 'userCount'
    > {}

function SwarmForm({
  availableShapeClasses,
  availableUserClasses,
  host,
  extraOptions,
  isShape,
  overrideHostWarning,
  runTime,
  setSwarm,
  showUserclassPicker,
  spawnRate,
  userCount,
}: ISwarmForm) {
  const onStartSwarm = (inputData: ISwarmFormInput) => {
    setSwarm({ state: SWARM_STATE.RUNNING });

    asyncRequest('swarm', {
      method: REQUEST_METHODS.POST,
      body: inputData,
      form: true,
    });
  };

  return (
    <Container maxWidth='md' sx={{ my: 2 }}>
      <Typography component='h2' noWrap variant='h6'>
        Start new load test
      </Typography>
      <Form<ISwarmFormInput> onSubmit={onStartSwarm}>
        <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', rowGap: 4 }}>
          {showUserclassPicker && (
            <>
              <Select
                label='User Classes'
                multiple
                name='userClasses'
                options={availableUserClasses}
              />
              <Select label='Shape Class' name='shapeClass' options={availableShapeClasses} />
            </>
          )}

          <TextField
            defaultValue={(isShape && '-') || userCount || 1}
            disabled={!!isShape}
            label='Number of users (peak concurrency)'
            name='userCount'
          />
          <TextField
            defaultValue={(isShape && '-') || spawnRate || 1}
            disabled={!!isShape}
            label='Ramp Up (users started/second)'
            name='spawnRate'
            title='Disabled for tests using LoadTestShape class'
          />
          <TextField
            defaultValue={host}
            label={`Host ${
              overrideHostWarning
                ? '(setting this will override the host for the User classes)'
                : ''
            }`}
            name='host'
            title='Disabled for tests using LoadTestShape class'
          />
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Advanced options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                defaultValue={runTime}
                label='Run time (e.g. 20, 20s, 3m, 2h, 1h20m, 3h30m10s, etc.)'
                name='runTime'
                sx={{ width: '100%' }}
              />
            </AccordionDetails>
          </Accordion>
          {!isEmpty(extraOptions) && <CustomParameters extraOptions={extraOptions} />}
          <Button size='large' type='submit' variant='contained'>
            Start Swarm
          </Button>
        </Box>
      </Form>
    </Container>
  );
}

const storeConnector = ({
  swarm: {
    availableShapeClasses,
    availableUserClasses,
    extraOptions,
    isShape,
    host,
    numUsers,
    overrideHostWarning,
    runTime,
    spawnRate,
    showUserclassPicker,
    userCount,
  },
}: IRootState) => ({
  availableShapeClasses,
  availableUserClasses,
  extraOptions,
  isShape,
  host,
  overrideHostWarning,
  showUserclassPicker,
  numUsers,
  runTime,
  spawnRate,
  userCount,
});

const actionCreator: IDispatchProps = {
  setSwarm: swarmActions.setSwarm,
};

export default connect(storeConnector, actionCreator)(SwarmForm);
