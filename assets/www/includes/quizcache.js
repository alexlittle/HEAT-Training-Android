
function loadQuizzesFromCache(){
	var pnc1 = {
		"refid" : "qt24f8d5c79817d2",
		"ref" : "qt24f8d5c79817d2",
		"title" : "HEAT - PNC - SAQs for Study Session 1",
		"description" : "",
		"maxscore" : "20",
		"lastupdate" : "2012-04-17 12:14:08",
		"q" : [
				{
					"refid" : "qqt24f8d5e95e32ce",
					"orderno" : "1",
					"text" : "'Neonate' is 'a newborn baby'. Is this definition:",
					"type" : "multichoice",
					"props" : {
						"maxscore" : "10",
						"type" : "multichoice"
					},
					"r" : [ {
						"refid" : "qqrt24f8d5e95e3e86",
						"orderno" : "1",
						"text" : "correct",
						"score" : "10",
						"props" : {
							"feedback" : "Correct! neonate is a newborn baby."
						}
					}, {
						"refid" : "qqrt24f8d5e95f2c5e",
						"orderno" : "2",
						"text" : "partially correct",
						"score" : "0",
						"props" : {
							"feedback" : "Try again!"
						}
					}, {
						"refid" : "qqrt24f8d5e95f37fe",
						"orderno" : "3",
						"text" : "wrong",
						"score" : "0",
						"props" : {
							"feedback" : "Try again!"
						}
					} ]
				},
				{
					"refid" : "qqt24f8d5e960054e",
					"orderno" : "2",
					"text" : "'Postnatal care (PNC)' is 'the care given to the baby immediately after birth'. Is this definition:",
					"type" : "multichoice",
					"props" : {
						"maxscore" : "10",
						"type" : "multichoice"
					},
					"r" : [
							{
								"refid" : "qqrt24f8d5e973104d",
								"orderno" : "1",
								"text" : "correct",
								"score" : "0",
								"props" : {
									"feedback" : "Try again!"
								}
							},
							{
								"refid" : "qqrt24f8d5e973239f",
								"orderno" : "2",
								"text" : "partially correct",
								"score" : "10",
								"props" : {
									"feedback" : "That\\'s right. It is the care given to the baby and the mother immediately after birth and for the first 6 weeks of life."
								}
							}, {
								"refid" : "qqrt24f8d5e9732f3a",
								"orderno" : "3",
								"text" : "wrong",
								"score" : "0",
								"props" : {
									"feedback" : "Try again!"
								}
							} ]
				},
				{
					"refid" : "qqt24f8d5e9734292",
					"orderno" : "3",
					"text" : "Imagine that you are trying to convince the Ethiopian Finance Minister to put more money into postnatal health care and he wants the evidence as to why. Write a short letter outlining the key points that you would emphasise.",
					"type" : "essay",
					"props" : {
						"maxscore" : "0",
						"type" : "essay"
					},
					"r" : []
				} ]
	};
	if(!quizInCache('qt24f8d5c79817d2')){
		store.addArrayItem('quizzes', pnc1);
	}

}