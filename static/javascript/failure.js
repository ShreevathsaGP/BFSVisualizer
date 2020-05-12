// || FAILURE BECAUSE OF RECURSION --> Basically it did not work because of: Avoid Maximum call stack size exceeded ||
//------------------------------------------------------------------------------------------------------------------------------------------------------------------
class DepthFirst {
    constructor(maze) {
        this.maze = maze;
        this.visited = [];
        this.path = [];
        this.queue = [];

        this.start_node = this.maze[this.maze.findIndex(x => x.node_type === 'start')].node_pos;
        this.finish_node = this.maze[this.maze.findIndex(x => x.node_type === 'finish')].node_pos;

        this.status = '1'; // Solve() runs if 1 and does not if 0
    }
    declare() {
        // Depth first search looks (In my case) --> Right, Down, Left, Up
        console.log(`Start node: ${this.start_node}\nFinish node: ${this.finish_node}`);
        this.visited.push(this.start_node);

        // This will begin the a series of functions to find path to the goal node
        this.right(this.start_node);
    }

    // Right function
    right(pos) {
        this.current_node = pos;
        console.log(this.current_node);

        this.node_right = [this.current_node[0], this.current_node[1]+1]

        // Which node this function was caled by (in order to be used in back tracking)
        this.called_by = [this.node_right[0], this.node_right[1]-1]

        // Check if the one right to the current node is already visited, is a wall
        if (this.visited.findIndex(x => JSON.stringify(x) === JSON.stringify(this.node_right)) !== -1) {
            console.log('Includes at --> right');
            this.backtrack(this.called_by, 'down');

        } else if (this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_right)) === -1 || this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_right))].node_type === 'wall' || this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_right))].node_type === 'start') {
            this.down(this.current_node)
        } else if (this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_right))].node_type === 'finish'){
            // Come back to this
        } else {
            this.current_node = this.node_right
            console.log(this.current_node)
            this.visited.push(this.current_node);
            this.updateGrid(this.current_node);
            this.up(this.current_node)
        }
    }
    
    // Down function
    down(pos) {
        this.current_node = pos;
        console.log(this.current_node);

        this.node_down = [this.current_node[0]+1, this.current_node[1]]

        // Which node this function was caled by (in order to be used in back tracking)
        this.called_by = [this.node_down[0]-1, this.node_down[1]]

        // Check if the one down to the current node is already visited, is a wall
        if (this.visited.findIndex(x => JSON.stringify(x) === JSON.stringify(this.node_down)) !== -1) {
            console.log('Includes at --> down');
            this.backtrack(this.called_by, 'left');

        } else if (this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_down)) === -1 || this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_down))].node_type === 'wall' || this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_down))].node_type === 'start') {
            this.left(this.current_node)
        } else if (this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_down))].node_type === 'finish'){
            // Come back to this
        } else {
            this.current_node = this.node_down
            console.log(this.current_node)
            this.visited.push(this.current_node);
            this.updateGrid(this.current_node);
            this.down(this.current_node)
        }
    }

    // Left function
    left(pos) {
        this.current_node = pos;
        console.log(this.current_node);

        this.node_left = [this.current_node[0], Number(this.current_node[1])-1]

        // Which node this function was caled by (in order to be used in back tracking)
        this.called_by = [this.node_left[0], this.node_left[1]+1]

        // Check if the one left to the current node is already visited, is a wall
        if (this.visited.findIndex(x => JSON.stringify(x) === JSON.stringify(this.node_left)) !== -1) {
            console.log('Includes at --> left');
            this.backtrack(this.called_by, 'up');

        } else if (this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_left)) === -1 || this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_left))].node_type === 'wall' || this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_left))].node_type === 'start') {
            this.up(this.current_node)
        } else if (this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_left))].node_type === 'finish'){
            // Come back to this
        } else {
            this.current_node = this.node_left
            console.log(this.current_node)
            this.visited.push(this.current_node);
            this.updateGrid(this.current_node);
            this.left(this.current_node)
        }
    }
    
    // Up function
    up(pos) {
        this.current_node = pos;
        console.log(this.current_node);

        this.node_up = [this.current_node[0]-1, Number(this.current_node[1])]

        // Which node this function was caled by (in order to be used in back tracking)
        this.called_by = [this.node_up[0]+1, this.node_up[1]]

        // Check if the one left to the current node is already visited, is a wall
        if (this.visited.findIndex(x => JSON.stringify(x) === JSON.stringify(this.node_up)) !== -1) {
            console.log('Includes at --> up');
            this.backtrack(this.called_by, 'right');

        } else if (this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_up)) === -1 || this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_up))].node_type === 'wall' || this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_up))].node_type === 'start') {
            this.right(this.current_node)
        } else if (this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.node_up))].node_type === 'finish'){
            // Come back to this
        } else {
            this.current_node = this.node_up;
            console.log(this.current_node);
            this.visited.push(this.current_node);
            this.updateGrid(this.current_node);
            this.up(this.current_node)
        }
    }

    // Backtrack function initiated when right, down, left or up tries to go into an already visited node
    backtrack (pos, direction) {
        
        // If the the node is the start node, then reset, and try another direction
        if (JSON.stringify(pos) === JSON.stringify(this.start_node)) {
            console.log(`\n\nRESET TO START, CHANGING DIRECTION --> ${direction}`)
            this.backtrack_node = pos;
            this.visited.length = 0; // Empty visited, as we try another direction
            this.visited.push(this.start_node);
        } else {
            this.backtrack_node = this.visited[this.visited.findIndex(x => JSON.stringify(x) === JSON.stringify(pos))-1];
        }

        //console.log(this.backtrack_node);

        if (direction === "right") {
            this.right(this.backtrack_node);
        } else if (direction === "down") {
            this.down(this.backtrack_node);
        } else if (direction === "left") {
            this.left(this.backtrack_node);
        } else if (direction === "up") {
            this.up(this.backtrack_node)
        } else {
            console.log("Incorrect direction was given for backtracking!")
        }
    }

    // Udating the grid
    updateGrid(pos) {
        if (document.getElementById(`${pos[0]}-${pos[1]}`).className === 'start-node' || document.getElementById(`${pos[0]}-${pos[1]}`).className === 'finish-node' || document.getElementById(`${pos[0]}-${pos[1]}`).className === 'wall-node') {
            //pass
        } else {
            document.getElementById(`${pos[0]}-${pos[1]}`).className = 'visited';
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------
// || FAILURE BECAUSE OF RECURSION --> Basically it did not work because of: Avoid Maximum call stack size exceeded ||