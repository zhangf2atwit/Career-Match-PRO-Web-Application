import React, { Component } from 'react'
import '../css/searchJob.css'
import { ThreeDots } from 'react-loader-spinner';

class JobCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [],
            saveText: "Save Job",
            isLoading: false,
        }
    }

    componentDidMount() {
        this.fetchingJobs()
    }

    async saveJob(jobTitle, jobLocation, jobDescription, organizationName, salary, jobBoard, url) {
        const newSavedJob = {
            jobTitle: jobTitle,
            jobLocation: jobLocation,
            jobDescription: jobDescription,
            organizationName: organizationName,
            salary: salary,
            jobBoard: jobBoard,
            url: url,
            accountID: localStorage.getItem('userID'),
        }

        const newSavedJobOptions = {

            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSavedJob)

        }

        await fetch("http://localhost:3001/savedJobs", newSavedJobOptions)
            .then(response => response.text())
            .catch(error => console.log('error', error));
    }

    changeText = (id, saveText) => {
        console.log("id=" + id);

        this.setState({ saveText });
    }

    // authorize user's input
    async fetchingJobs() {
        this.setState({ isLoading: true })
        // fetch jobs
        let url = 'http://localhost:3001/jobs/?search=' + localStorage.getItem("jobTitle") + '&location=' + localStorage.getItem("location")
        console.log(url)
        try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error('Request failed');
            }
        
            const results = await response.json();
            console.log(results);
            this.setState({ results: results }, () => {
              console.log('Results are:');
              console.log(this.state.results);
              console.log(localStorage.getItem('userID'));
              this.setState({ isLoading: false }, () => {
                console.log(this.state.isLoading);
              });
            });
          } catch (error) {
            console.log('Error:', error);
            this.setState({ isLoading: false });
          }
    }

    render() {
        console.log("we are here in the job card component")
        return this.state.isLoading ? (
            <div class="loader">
                <ThreeDots type="ThreeDots" color="#BADA55" height="100" width="100" />
            </div>
        ) : (
            this.state.results.map(job => {
                return (
                    <div>
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">{job.jobTitle} - {job.jobBoard}</h4>
                                <h5 class="card-title">{job.organizationName}</h5>
                                <h6>{job.jobLocation}</h6>
                                <h6>{job.salary}</h6>
                                <p class="card-text">{job.jobDescription}</p>
                                <button class='btn' onClick={() => { window.open(job.url, "_blank") }}>View Job</button>
                                <input type="button" value={this.state.saveText} class='btn' id='saveBtn' onClick={(e) => { e.target.value = "Saved"; this.saveJob(job.jobTitle, job.jobLocation, job.jobDescription, job.organizationName, job.salary, job.jobBoard, job.url); }} />
                            </div>
                        </div>
                        <br />
                    </div>
                )
            })
        )
    }
}

export default JobCard;