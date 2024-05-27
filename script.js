console.log("lets write some js");

//function to convert seconds to minutes:seconds format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return formattedMinutes + ":" + formattedSeconds;
}

// fetching songs
var currfolder;
var songs;

async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/proj%2013-SpotifyClone/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

     songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

      // get the list of all the songs 
    //   songs = await getsongs("songs/likedsongs");
    //   console.log(songs);
  
      // listing the song names on the songboxes
      var songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
      songUL.innerHTML="";
      for (const song of songs) {
          songUL.innerHTML = songUL.innerHTML + `<li>
          <div class="songimg" ><img height="30px" width="30px" src="music.jpg" alt="music"></div>
  
          <div class="songname" >
              <div>${song.split("-")[0].replaceAll("%20", " ").replaceAll("_", " ").replaceAll("/", "")}</div>
              <div>${song.split("-")[1].replaceAll("%20", " ").replaceAll("_", " ").replaceAll("/", "")}</div>
          </div>
  
          <div class="play2"><img id="playgreen" src="play2.svg" alt="img"></div>
                                                      </li>`;
  
      }
      //attach an event listener(on click) to each song
  
      Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
          e.addEventListener("click", element => {
              console.log((e.querySelector(".songname").firstElementChild.innerHTML + "-" + e.querySelector(".songname").lastElementChild.innerHTML).trim());
              playMusic((e.querySelector(".songname").firstElementChild.innerHTML + "-" + e.querySelector(".songname").lastElementChild.innerHTML).trim());
              playgreen.src = "pause2.svg";
          })
      })

      return songs;
      
}

//play audio function

var currentsong = new Audio;
var songs;
const playMusic = (track) => {
    currentsong.src = `/proj%2013-SpotifyClone/${currfolder}/` + track;
    currentsong.play();
    play.src = "pause.svg";
    console.log(track);
    document.querySelector(".song_artist").innerHTML = track.replaceAll("%20", " ");

}

async function main() {

 // Get the list of all the songs
 await getsongs("songs/likedsongs");
 playMusic(songs[0], true);

  
    //attach an event listener to play,pause
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg";
        }
        else {
            currentsong.pause();
            play.src = "play.svg";

        }
    })
    //attach an event listener to playgreen

    // playgreen.addEventListener("click", () => {
    //     if (currentsong.paused) {
    //         currentsong.play();
    //         playgreen.src = "pause2.svg";
    //     }
    //     else {
    //         currentsong.pause();
    //         playgreen.src = "play2.svg";

    //     }
    // })

    //attach an event listener for time updates

    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".currenttime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}`;
        document.querySelector(".totaltime").innerHTML = `${secondsToMinutesSeconds(currentsong.duration)}`;

        document.querySelector(".playball1").style.right = (67 - (1 / 2.89) * ((currentsong.currentTime / currentsong.duration) * 100)) + "%";

    })
    console.log(currentsong.currentTime, currentsong.duration);

    //Attach an event listener to the seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".playball1").style.right = (63.5 - percent) + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })

    //attach an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    //attach an event listener to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //attach an event listener to next 

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split(`/${currfolder}/`)[1]);

        console.log(currentsong);
        console.log(currentsong.src.split(`/${currfolder}/`)[1]);
        console.log(index);


        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
            console.log(songs[index + 1]);

        }
    })
    //attach an event listener to previous

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split(`/${currfolder}/`)[1]);

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    })

    //attach an event listener to volume bar
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = (parseInt(e.target.value) / 100);
    })

    //autoplay next
    currentsong.addEventListener('ended', () => {
        let index = songs.indexOf(currentsong.src.split(`/${currfolder}/`)[1]);
        if (index !== -1 && index < songs.length - 1) {
            playMusic(songs[index + 1]);
            console.log(songs[index + 1]);
        } else {
            console.log('End of playlist');
        }
    });

    //load that playlist whichever card or banner is clicked
    Array.from(document.querySelectorAll(".dailymix1")).forEach(e => {
        console.log(e);
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset.folder);
            
            songs = await getsongs.then(`songs/${item.currentTarget.datset.folder}`);

console.log(songs);

        })
    })




}
main();
