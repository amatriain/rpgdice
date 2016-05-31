var ChatTab = React.createClass({
	render: function() {
		return (
			<div className="commentBox">
				Hello, world! I am a CommentBox.
			</div>
		);
	}
});

ReactDOM.render (
	<ChatTab />,
	$("#chat-pane")
);
