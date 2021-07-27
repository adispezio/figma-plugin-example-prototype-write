import { render, Container, Text, Layer, Button, VerticalSpace, IconLayerFrame16, MiddleAlign } from '@create-figma-plugin/ui'
import { emit, on, once } from '@create-figma-plugin/utilities';
import { h, Fragment, FunctionComponent } from 'preact'
import { useState } from 'preact/hooks'
import styles from './styles.css'

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

function Plugin () {
    const [state, setState] = useState<uiState>({
        wizardStep: 'SELECT_ORIGINS',
        selection: [],
        origins: [],
        validOrigins: false,
    });

    const handleUpdateSelection = function(data:any) {
        setState(prevState => {
            return {
                ...prevState,
                selection: data
            }
        });

        validateSelection(data);
    }
      
    const validateSelection = function(data:any) {
        if(data.length > 0) {
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

    const handleConfirmOrigins = function(){
        setState(prevState => {
            return {
                ...prevState,
                origins: prevState.selection,
                wizardStep: 'SELECT_DESTINATIONS'
            }
        });

        emit('CONFIRM_ORIGINS')
    }

    const handleConfirmDestinations = function() {
        emit('CONFIRM_DESTINATIONS')
    }


    const RenderUI = () => {
        if (state.wizardStep === 'SELECT_ORIGINS') {
            return (
                <Fragment>
                    <Text bold>Step 1: Select layers ({state.selection.length})</Text>
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


