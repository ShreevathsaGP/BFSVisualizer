const rows = 20;
const columns = 30;
const grid_holder = document.getElementById("grid-holder");
const reset_button = document.getElementById("reset-button");
const solve_button = document.getElementById("calculate-button");

errorMessage("This is where error messages will appear!")


//-----------------------------------------------------------------------------------------------------------------------------------------------
// all non algorithmic functions that make the viruals of the page
//-----------------------------------------------
function MakeGrid(rows, columns) {
    this.columns = columns;
    this.rows = rows;

    grid = "<table id='grid'>"

    for (let i = 0; i < rows; i++) {
        row_no = i + 1

        row = '\n\n    <tr>'
        if (i===10) {
            for (let i = 0; i < columns; i++) {
                column_no = i + 1
             
                if (i===2){
                    row += `\n    <td id="${Number(row_no)}-${Number(column_no)}" class="start-node"> </td>`
                } else if (i===27){
                    row += `\n    <td id="${Number(row_no)}-${Number(column_no)}" class="finish-node"> </td>`
                } else {
                    row += `\n    <td id="${Number(row_no)}-${Number(column_no)}" class="regular-node"> </td>`
                }
            }
        } else {
            for (let i = 0; i < columns; i++) {
                column_no = i + 1
                row += `\n    <td id="${Number(row_no)}-${Number(column_no)}" class="regular-node"> </td>`
            }
        }
        row += '\n\n    </tr>'

        grid+=row
    }

    grid += '</table>'

    grid_holder.innerHTML = '';
    grid_holder.innerHTML = grid;

}
MakeGrid(rows, columns)
//-----------------------------------------------

// Array to track node movemenet
start_visited = [] // All nodes visited by start node movement (will chose last one!)
finish_visited = [] // All nodes visited by finish node movement (will chose last one!)

// Variable to track the process
var isUnderGo = false

// Variables to add and move nodes
var isRegularClicked = false;
var isStartClicked = {'state':false, 'source':''}
var isFinishClicked = {'state':false, 'source':''};


//-----------------------------------------------
function EditGrid() {
    // Reset lists
    start_visited.length = 0;
    finish_visited.length = 0;
    // Reset lists

    // Prevent default
    $("td").mousedown(function() {
        event.preventDefault()
    });
    $("tr").mousedown(function() {
        event.preventDefault()
    });
    $("table").mousedown(function() {
        event.preventDefault()
    });

    // Regular node & Wall node
    //-----------------------------------------------
    function RegularNode() {
        $(".regular-node").mousedown(function() {
            if (isUnderGo) {
                //pass
            } else {
                let node = event.target;
                let node_class = node.className;
                let node_id = node.id;
                
                // Add wall node
                if (node_class === 'regular-node') {
                    document.getElementById(String(node_id)).className = 'wall-node';
                } else if (node_class === 'wall-node') {
                    document.getElementById(String(node_id)).className = 'regular-node';
                }
                // Add wall node
                isRegularClicked = true;
            }
        })
    }

    $(".regular-node").mouseup(function() {
        if (isUnderGo) {
            //pass
        } else {
            isRegularClicked = false;
            RegularNode() // Refresh list
        }
    })
    //-----------------------------------------------

    //-----------------------------------------------
    // Start node
    function StartNode() {
        $(".start-node").mousedown(function() {
            if (isUnderGo) {
                //pass
            } else {
                let node = event.target;
                let node_class = node.className;
                let node_id = node.id;

                isStartClicked['state'] = true;
                isStartClicked['source'] = String(node_id);
                //console.log(isStartClicked['source'])
            }
        })
    }
    //-----------------------------------------------

    //-----------------------------------------------
    // Finish node
    function FinishNode() {
        $(".finish-node").mousedown(function() {
            if (isUnderGo) {
                //pass
            } else {
                let node = event.target;
                let node_class = node.className;
                let node_id = node.id;

                isFinishClicked['state'] = true;
                isFinishClicked['source'] = String(node_id);
                //console.log(isFinishClicked['source'])
            }
        })
    }
    //-----------------------------------------------

    //-----------------------------------------------
    // Mouse up
    $("td").mouseup(function() {
        if (isUnderGo) {
            //pass
        } else {
            isStartClicked['state'] = false;
            isFinishClicked['state'] = false;
            StartNode() // Refresh list
            FinishNode() // Refresh list
        }
    })
    //-----------------------------------------------

    //-----------------------------------------------
    $("td").mouseenter(function() {
        if(isUnderGo) {
            //pass
        } else {
            let node = event.target;
            let node_class = node.className;
            let node_id = node.id;

            // Regular node and Wall node
            if (isRegularClicked) {
                if (node_class === 'regular-node') {
                    document.getElementById(String(node_id)).className = 'wall-node';
                } else if (node_class === 'wall-node') {
                    document.getElementById(String(node_id)).className = 'regular-node';
                }
            } else {
                //pass
            }

            // Start node
            if (isStartClicked['state']) {
                if (node_class === 'finish-node') {
                    // pass
                } else {
                    document.getElementById(isStartClicked['source']).className = 'regular-node';
                    start_visited.push(node_id);
                    if (start_visited.length > 1) {
                        document.getElementById(String(start_visited[start_visited.length - 2])).className = 'regular-node';
                    }   
                    document.getElementById(String(start_visited[start_visited.length - 1])).className = 'start-node';
                }        
            }

            // Finish node
            if (isFinishClicked['state']) {
                if (node_class === 'start-node') {
                    // pass
                } else {
                    document.getElementById(isFinishClicked['source']).className = 'regular-node';
                    finish_visited.push(node_id);
                    if (finish_visited.length > 1) {
                        document.getElementById(String(finish_visited[finish_visited.length - 2])).className = 'regular-node';
                    }
                    document.getElementById(String(finish_visited[finish_visited.length - 1])).className = 'finish-node';
                }        
            }
        }

    });
    //-----------------------------------------------
}
EditGrid()
//-----------------------------------------------

// Pathfinding status
var isProcessing = false;

//-----------------------------------------------
// Reset Grid
reset_button.onclick = function() {
    if (isProcessing) {
        //pass
    } else {
        //console.log("RESET GRID!");
        MakeGrid(rows, columns);
        isUnderGo = false;
        EditGrid()
    }
}

// Conduct Search
solve_button.onclick = function() {
    if (isProcessing) {
        //pass
    } else {
        isUnderGo = true;
        ComputeGrid();
    }
}
//-----------------------------------------------

// Maze holder
var maze = []


//-----------------------------------------------
function ComputeGrid() {
    if (document.getElementById('algo-choice').value === 'choose'){
        errorMessage("please choose a valid algorithm!")
        isUnderGo = false;
        return; //exit function
    } else {
        errorMessage("no errors!")
    }
    
    var algo_choice = document.getElementById('algo-choice').value;
    
    isProcessing = true;
    nodes = document.getElementsByTagName('td');
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].className === 'start-node') {
            i_node_type = 'start'
        } else if (nodes[i].className === 'finish-node') {
            i_node_type = 'finish'
            // Change the wall statement for real thing
        } else if (nodes[i].className === 'wall-node') {
            i_node_type = 'wall'
        } else {
            i_node_type = 'regular'
        };

        let push_value = {node_pos:[Number(String(nodes[i].id).split("-")[0]), Number(String(nodes[i].id).split("-")[1])], node_type:i_node_type};
        maze.push(push_value);
    }
    
    if (algo_choice === 'depth-first') {
        new DepthFirst(maze, 10).search()
    } else if (algo_choice === 'breadth-first') {
        new BreadthFirst(maze, 10).search()
    } else if (algo_choice === 'a-star') {
        new AStar(maze, 10).search()
    }
    
};
//-----------------------------------------------


//-----------------------------------------------
// Display an error with the user's actions
function errorMessage(message) {
    document.getElementById('error-box').innerHTML = `<p id="error">${message}</p>`
}
//-----------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------------------
class AStar {
    constructor(maze, ms) {
        this.maze = maze;
        this.queue = [];
        this.speed = ms;
    }

    search() {
        console.log(this.maze);
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------------------
class DepthFirst {
    constructor(maze, ms) {
        this.maze = maze;
        this.queue = [];
        this.speed = ms;
    }

    search() {
        // pass
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------------------
class BreadthFirst {
    constructor(maze_in, ms) {
        this.maze = maze_in;
        this.queue = [""]; // Queue holds valid routes
        this.speed = ms;
        this.directions = [ "l", "r", "u", "d"];
        this.visited = [] // Extended list to prevent extending into nodes that were already extended
        
        this.path = "" // Will be the final shortest path

        this.start_node = this.maze[this.maze.findIndex(x => x.node_type === 'start')].node_pos;
        this.finish_node = this.maze[this.maze.findIndex(x => x.node_type === 'finish')].node_pos;

        this.iteration = 0; // Used to see if path does not exist
        this.visited_old = [] // For visualization when there is no path available
    }

    //-----------------------------------------------
    search() {
        while(this.is_end(this.path) === false) {

            // I AM TOO LAZY TO FIX PROBLEM, SO I LEAVE IT LIKE THIS
            if (this.queue.length === 0) { // Weird thing happening with nodes, switch up order and start over
                this.queue.push("");
                this.change_direction = this.directions[0];
                this.directions.shift();
                this.directions.push(this.change_direction);
                this.iteration += 1;
                if (this.iteration === 1) {
                    this.visited_old = this.visited.concat();
                }
                this.visited.length = 0;
                if (this.iteration > 3) {
                    errorMessage("There is no path available");
                    isUnderGo = false;
                    isProcessing = false;
                    this.maze = NaN;
                    maze.length = 0;
                    visualize_search(this.visited_old, this.sleep, this.path, this.start_node, this.finish_node, false);
                    break
                }

            }

            this.path = this.queue[0];

            for (let i = 0; i < this.directions.length; i++) {
                this.try_path = this.queue[0] + this.directions[i];
                if (this.validate(this.try_path)) {
                    this.queue.push(this.try_path);
                } else {
                    //pass
                }
            }
            
            this.queue.shift(); // Removes first value from the queue, which is how queues work. FIFO (First In First Out)
        }
    }
    //-----------------------------------------------

    //-----------------------------------------------
    validate (path) {
        this.path = path

        this.validate_node = this.start_node;

        for (let i = 0; i < this.path.length; i++) {
            if (this.path[i] === "l") {
                this.validate_node = [this.validate_node[0], this.validate_node[1]-1]
            } else if (this.path[i] === "r") {
                this.validate_node = [this.validate_node[0], this.validate_node[1]+1]
            } else if (this.path[i] === "u") {
                this.validate_node = [this.validate_node[0]-1, this.validate_node[1]]
            } else if (this.path[i] === "d") {
                this.validate_node = [this.validate_node[0]+1, this.validate_node[1]]
            } else {
                console.log("Incorrect directions in path!")
            }
        }

        // If node already extended, dont do it again
        if (this.visited.findIndex(x => JSON.stringify(x) === JSON.stringify(this.validate_node)) !== -1) {
            //console.log('exists')
            this.visited.push(this.validate_node);
            return false
        } else {
            this.visited.push(this.validate_node);
        }

        if (this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.validate_node)) === -1 || this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.validate_node))].node_type === 'wall') {
            return false
        } else {
            return true
        }
    }
    //-----------------------------------------------

    //-----------------------------------------------
    is_end(path) {
        this.path = path;
        
        this.validate_node = this.start_node;

        for (let i = 0; i < this.path.length; i++) {
            if (this.path[i] === "l") {
                this.validate_node = [this.validate_node[0], this.validate_node[1]-1]
            } else if (this.path[i] === "r") {
                this.validate_node = [this.validate_node[0], this.validate_node[1]+1]
            } else if (this.path[i] === "u") {
                this.validate_node = [this.validate_node[0]-1, this.validate_node[1]]
            } else if (this.path[i] === "d") {
                this.validate_node = [this.validate_node[0]+1, this.validate_node[1]]
            } else {
                console.log("Incorrect directions in path!")
            }
        }

        if (this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.validate_node)) === -1) {
            return false
        }

        if (this.maze[this.maze.findIndex(x => JSON.stringify(x.node_pos) === JSON.stringify(this.validate_node))].node_type === 'finish') {
            
            // Visualize the search and then show the path that was found
            visualize_search(this.visited, this.sleep, this.path, this.start_node, this.finish_node, true);
            
            isUnderGo = false;
            isProcessing = false;
            this.maze = NaN;
            maze.length = 0;
            return true
        }
        return false
    }
    //-----------------------------------------------
}
//-----------------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------
// Function to visualize path
async function visualize_path(path, sleep_time, start, finish) {
    path_ids = [start];
    
    //  Convert string path into a list of path nodes (coordinates)
    for (let i = 0; i < path.length; i++) {
        if (path[i] === "l") {
            push_node = [path_ids[path_ids.length - 1][0], path_ids[path_ids.length - 1][1]-1];

            if (JSON.stringify(push_node) === JSON.stringify(finish)) {
                break
            }
            path_ids.push(push_node);
        } else if(path[i] === "r") {
            push_node = [path_ids[path_ids.length - 1][0], path_ids[path_ids.length - 1][1]+1];

            if (JSON.stringify(push_node) === JSON.stringify(finish)) {
                break
            }
            path_ids.push(push_node);
        } else if (path[i] === "u") {
            push_node = [path_ids[path_ids.length - 1][0]-1, path_ids[path_ids.length - 1][1]];

            if (JSON.stringify(push_node) === JSON.stringify(finish)) {
                break
            }
            path_ids.push(push_node);
        } else if (path[i] === "d") {
            push_node = [path_ids[path_ids.length - 1][0]+1, path_ids[path_ids.length - 1][1]];

            if (JSON.stringify(push_node) === JSON.stringify(finish)) {
                break
            }
            path_ids.push(push_node);
        } else {
            console.log("INCORRECT DIRECTIONS GIVEN --> CANNOT VISUALIZE PATH")
        }
    }

    if (JSON.stringify(path_ids[0]) === JSON.stringify(start)) {
        path_ids.shift() // Removing start node from beginning or array
    }

    for (let i = 0; i < path_ids.length; i++) {
        if (JSON.stringify(path_ids[i]) === JSON.stringify(finish)) {
            //pass
        } else {
            await sleep(100);
            document.getElementById(`${path_ids[i][0]}-${path_ids[i][1]}`).className = 'path';
        }  
    }
}
//-----------------------------------------------

//-----------------------------------------------
// Function to visualize the search (all the nodes being searched)
async function visualize_search(visited_nodes, sleep_time, path, start_node, finish_node, visualize_instruction) {
    this.visited_nodes = visited_nodes;

    for (let i = 0; i < this.visited_nodes.length; i++) {
        if (this.visited_nodes[i][0] > 20 || this.visited_nodes[i][0] < 1 || this.visited_nodes[i][1] > 30 || this.visited_nodes[i][1] < 1) {
            //pass
        } else {
            let search_node_id = `${this.visited_nodes[i][0]}-${this.visited_nodes[i][1]}`
            if (document.getElementById(search_node_id).className === 'finish-node') {
                break
            }
            if (document.getElementById(search_node_id).className === 'wall-node' || document.getElementById(search_node_id).className === 'start-node' || document.getElementById(search_node_id).className === 'finish-node') {
                //pass
            } else {
                await sleep(sleep_time);
                document.getElementById(search_node_id).className = 'visited';
            }
        }
    };

    // Show path that was found (if it was found)
    if (visualize_instruction === true) {
        visualize_path(path, sleep_time, start_node, finish_node);
    } else {
        //pass
    }
}
//-----------------------------------------------

//-----------------------------------------------
// Sleep for time --> milli-seconds (ms)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//-----------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------