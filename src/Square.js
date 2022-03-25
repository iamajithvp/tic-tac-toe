import React, { Component } from "react";

class Square extends Component {
    render() {
        let className = this.props.match.indexOf(this.props.index) !== -1 ? "square win" : "square";
        return (
            <button className={className} onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}

export default Square;