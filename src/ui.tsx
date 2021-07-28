// Create Figma Plugin utilities
import { emit, once } from '@create-figma-plugin/utilities';

// Preact
import { h, Fragment } from 'preact'
import { useState } from 'preact/hooks'
// Create Figma Plugin preact components
import { render, Container, Text, Button, VerticalSpace } from '@create-figma-plugin/ui'

// Custom css (for stuff not in the preact components)
import styles from './styles.css'

// Define the state object shape
interface uiState {
  wizardStep: string,
  selection: {
    name: string
  }[],
  origins: {
    name: string
  }[],
  validOrigins: boolean,
}

// Main plugin code
function Plugin() {

  // Setup the state
  const [state, setState] = useState<uiState>({
    wizardStep: 'SELECT_ORIGINS',
    selection: [],
    origins: [],
    validOrigins: false,
  });

  // Update the selection state
  // Used for both selecting origins and destinations
  const handleUpdateSelection = function (data: any) {
    setState(prevState => {
      return {
        ...prevState,
        selection: data
      }
    });

    validateSelection(data);
  }

  // Validate the selection
  // Right now this is only checking that there IS a selection
  // TODO: This could live in main.ts - see TODOs there
  const validateSelection = function (data: any) {
    if (data.length > 0) {
      setState(prevState => {
        return {
          ...prevState,
          validOrigins: true
        }
      });
    } else {
      setState(prevState => {
        return {
          ...prevState,
          validOrigins: false
        }
      });
    }
  }

  // Store the origins and set the plugin state to show next UI
  const handleConfirmOrigins = function () {
    setState(prevState => {
      return {
        ...prevState,
        origins: prevState.selection,
        wizardStep: 'SELECT_DESTINATIONS'
      }
    });

    emit('CONFIRM_ORIGINS')
  }

  // Notify main.ts so the current selection is used as destinations
  const handleConfirmDestinations = function () {
    emit('CONFIRM_DESTINATIONS')
  }


  const RenderUI = () => {

    // Show each of the UI steps based on the current plugin state
    if (state.wizardStep === 'SELECT_ORIGINS') {
      return (
        <Fragment>
          <Text bold>Step 1: Select layers ({state.selection.length})</Text>
          <VerticalSpace space="medium" />
          {state.selection.length > 0 ?
            <ul class={styles.layerlist}>
              {state.selection.map(node => (
                <li class={styles.layerlistitem}>
                  {node.name}
                </li>
              ))}
            </ul> :
            <div class={styles.makeSelection}>Select layers to add interactions</div>
          }
          <VerticalSpace space="medium" />
          <Button fullWidth disabled={!state.validOrigins} onClick={handleConfirmOrigins}>Select destination frames</Button>
        </Fragment>
      )
    } else if (state.wizardStep === 'SELECT_DESTINATIONS') {
      return (
        <Fragment>
          <Text bold>Step 2: Select destination frames ({state.selection.length})</Text>
          <VerticalSpace space="medium" />
          {state.selection.length > 0 ?
            <ul class={styles.layerlist}>
              {state.selection.map(node => (
                // <Result {...result} />
                <li class={styles.layerlistitem}>
                  {node.name}
                </li>
              ))}
            </ul> :
            <div class={styles.makeSelection}>Select frame(s)</div>
          }
          <VerticalSpace space="medium" />
          <Button fullWidth disabled={!state.validOrigins} onClick={handleConfirmDestinations}>Create interactions</Button>
        </Fragment>
      )
    } else {
      return null
    }
  }

  // Listen for selection updates from main.ts
  once('UPDATE_SELECTION', handleUpdateSelection)

  return (
    <Container space='small'>
      <VerticalSpace space='medium' />
      <RenderUI />
      <VerticalSpace space='medium' />
    </Container>
  )
}

export default render(Plugin)