
import React from "react";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSelection } from "../hooks/useSelection";
import Dialog from '../components/Msgdlg';
import io from "socket.io-client";
import { useEffect } from "react";

//import { selected } from './OnlineSessionStudent';

const OnlineSession = () => {

    const {student} = useAuthContext()
    //const {selection, error} = useSelection();
    //const { selected } = selected();
    var [Score, setScore ] = useState(1500)
    //for Dialog
    const [showTaskDlg, setShowTaskDlg] = useState(false);
    const [selectedstud, setSelectedStud] = useState('')
    const [dlgTitle, setdlgTitle] = useState('')

    var [aveScore, setAveScores] = useState(0);
    const  reducer = (accumulator, currentValue) => { return accumulator + currentValue};
    var [parRec, setRec ] = useState(3)
    const [currScore, setCurrentScore] = useState()

    const [uresults, setuResults] = useState([]);
    const [sresults, setsResults] = useState([]);
    const [uresults2, setuResults2] = useState([]);
    const [sresults2, setsResults2] = useState([]);
    const [uresults3, setuResults3] = useState([]);
    const [sresults3, setsResults3] = useState([]);
    //const [selected, setSelected] = useState(null);
   
//-------------LEDAERBOARD, UPDATING SCORE AND FREQUENCY---------------
    
    // for leaderboard array results
    const getResults = async (e) => {

        socket.emit("send_message", { message: "Hello" });
       
        const response = await fetch('/api/students/getResults')
        const data = await response.json()
      
      setuResults(data[0].username)
      setsResults(data[0].score)
      setuResults2(data[1].username)
      setsResults2(data[1].score)
      setuResults3(data[2].username)
      setsResults3(data[2].score)
        console.log(data)
         return data;
    
};

        //for update PARTICPATION FREQ //------new
    const updateFreq = async (e) => {
        
        const response = await fetch('/api/students/updateParticipation/' + selectedstud, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json',
                      'Authorization': `Bearer ${student.token}`},
            body:   JSON.stringify({participationRec:parRec})
            
        })
        
        const data = await response.json()
        
         return data;
    };

    //for update //------new
    const updateScore = async (e) => {
        
        const response = await fetch('/api/students/updateScore/' + selectedstud, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json',
                      'Authorization': `Bearer ${student.token}`},
            body:   JSON.stringify({score:Score})
            
        })
        
        const data = await response.json()
         
         return data;
    };

     const getStudentScore = async (e) => {
        
        const response = await fetch('/api/students/getScore/' + selectedstud)
        const data = await response.json()
        setCurrentScore(data[0].score)
        setScore(Score+currScore)
        console.log(Score)
        return data;
    };
//-------------------------------END----------------------------------



   
//-------------SELECTING TAKEAWAYS AND REWARD-------------------------

        // for getting average score
        const getAveScores = async (e) => {
      
        const response = await fetch('/api/students/scores')
        const data = await response.json()
     
        // get all scores
        const getRating = () => {
               return data
          }

        var i;
        const ratingScores = getRating()
        const theScores = [];

        for(i=0; i< ratingScores.length; i++)
        {theScores[i] = ratingScores[i].score}
        
        const addScores = theScores.reduce(reducer, 0);
      
        const averageScores = addScores / ratingScores.length;
       
        setAveScores(aveScore = averageScores)
        console.log(theScores)
        getLTStud()
        setShowTaskDlg(true);
        socket.emit("send_message")
        return data;
    };

    function random_item(items)
        {
  
        return items[Math.floor(Math.random()*items.length)];
     
    }

    
    // for all students below average score
    const getLTStud = async (e) => {
        
        const response = await fetch('/api/students/takeaway/' + aveScore)
        const data = await response.json()
     
        // get all students below ave score
        const getRating = () => {
               return data
          }

        var i;
        const studentsBelowAve = getRating()
        const theStudents = [];

        for(i=0; i< studentsBelowAve.length; i++)
        {theStudents[i] = studentsBelowAve[i].username}
        
        const stud = random_item(theStudents);
      
        console.log(stud)
        setSelectedStud(stud)
        getStudentScore();
        updateScore();
        updateFreq();

        return data;
    };

    function cancel() {
        console.log('Cancel');
        //deleteSelection();
        setShowTaskDlg(false);
        //updateScore();
        //setSelected();
        //setdlgTitle();
        //getStudentScore();
       getResults();
       // getLeaderboards();
        };
//-------------------------END------------------------



//-------------SERVER CONNECTION---------------
    //new 12-7
    const socket = io.connect("http://localhost:4001");
    
    // kay useeffect dapat ung paghcnage ng leaderbpards
    useEffect(() => {
        socket.on("receive_message", (data) => {
           
          //setdlgTitle("Takeaway")
         // getLTStud()
          //getAveScores()
          getResults()
            setShowTaskDlg(true);	
    });
    }, [socket])
    
/*const updateLeaderboard = () => {
        socket.emit("send_message", getAveScores() );
    };*/
//-------------------END--------------------
    
    
    return(
        <><div className="body dark">
            <Dialog 
                show = {showTaskDlg} 
                cancel= {cancel}  
                title = {dlgTitle}
                description= {selectedstud}
                />
            <div className="center2 end">
            <input type="submit" id="btnEnd" value="End Discussion" onClick={getAveScores} />
            
            </div>
            <div className="center3 leaderboard">
                <table id="myTable">
                    <thead>
                        <tr id="label">
                            <td>Rank</td>
                            <td>
                                Player
                            </td>
                            <td>
                                Score
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                    <tr id="winner">
                            <td>1</td>
                            <td><h6>{uresults}</h6></td>
                            <td><h6>{sresults}</h6></td>
                        </tr>
                        <tr id="runner-up">
                            <td>2</td>
                            <td><h6>{uresults2}</h6></td>
                            <td><h6>{sresults2}</h6></td>
                        </tr>
                        <tr id="second-runner-up">
                            <td>3</td>
                            <td><h6>{uresults3}</h6></td>
                            <td><h6>{sresults3}</h6></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div></>
        
    )
}

export default OnlineSession;