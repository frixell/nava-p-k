import React from 'react';
import { Route } from 'react-router-dom';
import UploadImageButton from '../common/UploadImageButton';



class EventImage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hover: false
        }
    }
    onMouseEnter = () => {
        const hover = true;
        this.setState(() => ({ hover }));
    };

    onMouseLeave = () => {
        const hover = false;
        this.setState(() => ({ hover }));
    };

    render() {
        return (
            <div data-id={this.props.id} className="events__event__box" onMouseEnter={this.props.onRollOver}>
                <UploadImageButton
                    action='setString'
                    field='image'
                    id={this.props.id}
                    name='item'
                />
                <img data-id={this.props.id} className="events__event__image" src={this.props.imageUrl} />
            </div>
        )
    }
}

export default EventImage;