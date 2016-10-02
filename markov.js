var markov = {
    input: "",
    chain_len: 5,
    num_output_chars: 0,
    
    run: function() {
	markov.num_output_chars = parseInt(document.getElementById("input-num-chars").value);
	poet1 = document.getElementById("poet1").value
	poet2 = document.getElementById("poet2").value

	this.getInputText(poet1);
	this.getInputText(poet2);

	this.markov_chain();

    },
    getInputText: function(poet) {
	var file_name = "https://jgerace.github.io/literarylovechild/sourcetext/";
	switch(poet) {
	case "dickinson":
	    file_name += "dickinson.txt";
	    break;
	case "coleridge":
	    file_name += "coleridge_short.txt";
	    break;
	case "whitman":
	    file_name += "whitman.txt";
	    break;
	case "browning":
	    file_name += "browning.txt";
	    break;
	case "rossetti":
	    file_name += "rossetti.txt";
	    break;
	case "hardy":
	    file_name += "hardy.txt";
	    break;
	default:
	    break;
	}

	this.getFile(file_name);
    },
    getFile: function(fileName) {
	$.ajax({
	    url: fileName,
	    dataType: "text",
	    async: false,
	    success: function(data) {
		markov.input += "" + String(data);
	    }
	});
    },
    markov_chain: function() {
	var table;
	table = this.create_table();
	console.log(table);

	output = this.generate_text(table);

	generated_text_box = document.getElementById("generated-text");
	generated_text_box.style.display = "block";
	generated_text_box.value = output;
    },
    create_table: function() {
	var table = {};

	for(var i = 0; i < this.input.length; i++) {
    	    chain = this.input.substr(i, this.chain_len);
    	    after = this.input.substr(i+this.chain_len, this.chain_len);

    	    if(!table[chain]) {
    		table[chain] = {};
    	    }

    	    if(!table[chain][after]) {
    		table[chain][after] = 1;
    	    }
    	    else {
    		table[chain][after]++;
    	    }
	}
	return table;
    },
    generate_text: function(table) {
	var keys = [];
	for(temp_key in table) {
    	    if(table.hasOwnProperty(temp_key)) {
    		keys.push(temp_key);
    	    }
	}

	choice = keys[Math.floor(Math.random() * keys.length)];

	output = choice;
	for(var idx = 0; idx < this.num_output_chars/this.chain_len; idx++) {
    	    new_char = this.get_random_next(table[choice]);
    	    if(new_char) {
    		choice = new_char;
    		output += choice;
    	    }
    	    else {
    		choice = table[keys[Math.floor(Math.random() * keys.length)]];
    	    }
	}

	return output;
    },
    get_random_next: function(choices) {
	total = 0;
	for(var elem in choices) {
	    total += choices[elem];
	}

	rand = Math.random() * total;
	
	for(var elem in choices) {
    	    weight = choices[elem];
    	    if(rand <= weight) {
    		return elem;
    	    }
    	    rand -= weight;
	}
    }
};
