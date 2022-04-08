//On load
window.onload = function() {
    setInterval(loadData, 990)
};

function loadData() {

    const clock = document.getElementById("nav-time");

    const tempElement     = document.getElementById("temp-value");
    const cloudElement    = document.getElementById("cloud-value");
    const rainElement     = document.getElementById("rain-value");
    const windElement     = document.getElementById("wind-value");
    
    fetch('v2/simulator/params')
    .then(res => res.json())
    .then(response => {
        clock.innerText = `${response.time.hours}:${response.time.minutes}:${response.time.seconds}`
        tempElement.innerText = `${response.params.temperature} °C`
        cloudElement.innerText = `${response.params.clouds} %`
        rainElement.innerText = `${response.params.precipitations} %`
        windElement.innerText = `${response.params.wind} kmh`
    })
    .catch(err => console.error(err))
}

// Hanlders
function deleteScenario(idScenario) {

    let isHeSure = confirm("Are you sur ?");

    if(isHeSure) {
        const request = {
            method  : 'DELETE',
            headers : { 'Content-Type': 'application/json', 'Accept' : 'application/json'},
            body    : JSON.stringify({
                idScenario : idScenario
            })
        }
        fetch('/v2/simulator/scenario', request)
        .then(res => res.json())
        .then(response => {
            if(response.code === "success") location.reload()
        })
        .catch(e => console.log(e))
    }
    
}

function selectScenarioPointerV2(id) {
    putScenarioPointer(id)
}


function createScenario() {
    // Could be replaced with a parsing fun but I m too lazy to do so :/
    let body = {
        "scenario_name" : document.getElementById("scenario_name").value,
        "season" : document.getElementById("season").value,
        "daytype" : document.getElementById("daytype").value,
        "scenario_intervals" : [
            {
                "param_type" : "temperature",
                "interval_values" : [
                    {
                        "from_to" : "00h-06h",
                        "inf" : document.getElementById("min-temp-0006").value,
                        "sup" : document.getElementById("max-temp-0006").value
                    },
                    {
                        "from_to" : "06h-12h",
                        "inf" : document.getElementById("min-temp-0612").value,
                        "sup" : document.getElementById("max-temp-0612").value
                    },
                    {
                        "from_to" : "12h-18h",
                        "inf" : document.getElementById("min-temp-1218").value,
                        "sup" : document.getElementById("max-temp-1218").value
                    },
                    {
                        "from_to" : "18h-00h",
                        "inf" : document.getElementById("min-temp-1800").value,
                        "sup" : document.getElementById("max-temp-1800").value
                    }
                ]
            },
            {
                "param_type" : "wind",
                "interval_values" : [
                    {
                        "from_to" : "00h-06h",
                        "inf" : document.getElementById("min-wind-0006").value,
                        "sup" : document.getElementById("max-wind-0006").value
                    },
                    {
                        "from_to" : "06h-12h",
                        "inf" : document.getElementById("min-wind-0612").value,
                        "sup" : document.getElementById("max-wind-0612").value
                    },
                    {
                        "from_to" : "12h-18h",
                        "inf" : document.getElementById("min-wind-1218").value,
                        "sup" : document.getElementById("max-wind-1218").value
                    },
                    {
                        "from_to" : "18h-00h",
                        "inf" : document.getElementById("min-wind-1800").value,
                        "sup" : document.getElementById("max-wind-1800").value
                    }
                ]
            },
            {
                "param_type" : "precipitations",
                "interval_values" : [
                    {
                        "from_to" : "00h-06h",
                        "inf" : document.getElementById("min-precipitation-0006").value,
                        "sup" : document.getElementById("max-precipitation-0006").value
                    },
                    {
                        "from_to" : "06h-12h",
                        "inf" : document.getElementById("min-precipitation-0612").value,
                        "sup" : document.getElementById("max-precipitation-0612").value
                    },
                    {
                        "from_to" : "12h-18h",
                        "inf" : document.getElementById("min-precipitation-1218").value,
                        "sup" : document.getElementById("max-precipitation-1218").value
                    },
                    {
                        "from_to" : "18h-00h",
                        "inf" : document.getElementById("min-precipitation-1800").value,
                        "sup" : document.getElementById("max-precipitation-1800").value
                    }
                ]
            },
            {
                "param_type" : "clouds",
                "interval_values" : [
                    {
                        "from_to" : "00h-06h",
                        "inf" : document.getElementById("min-clouds-0006").value,
                        "sup" : document.getElementById("max-clouds-0006").value
                    },
                    {
                        "from_to" : "06h-12h",
                        "inf" : document.getElementById("min-clouds-0612").value,
                        "sup" : document.getElementById("max-clouds-0612").value
                    },
                    {
                        "from_to" : "12h-18h",
                        "inf" : document.getElementById("min-clouds-1218").value,
                        "sup" : document.getElementById("max-clouds-1218").value
                    },
                    {
                        "from_to" : "18h-00h",
                        "inf" : document.getElementById("min-clouds-1800").value,
                        "sup" : document.getElementById("max-clouds-1800").value
                    }
                ]
            },

        ]

    }
    const request = {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json', 'Accept' : 'application/json'},
        body    : JSON.stringify(body)
    }
    fetch('/v2/simulator/scenario', request)
    .then(res => res.json())
    .then(response => {
        if(response.code === "success") {
            location.reload()
        }
    })
    .catch(e => console.log(e))
    
}

// Workers
function putScenarioPointer(id_scenario, callback) {
    const request = {
        method  : 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept' : 'application/json'},
        body    : JSON.stringify({idScenario : id_scenario})
    }
    fetch('/v2/simulator/params/pointer', request)
    .then(res => res.json())
    .then(response => {
        if(response.code === "success") callback()
    })
    .catch(e => console.log(e))
}

function getSimulatorParams(callback) {
    fetch('/v2/simulator/params', request)
    .then(res => res.json())
    .then(response => {
        if(response.code === "success") callback()
    })
    .catch(e => console.log(e))
}
