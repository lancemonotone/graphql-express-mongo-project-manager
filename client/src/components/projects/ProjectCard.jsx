const ProjectCard = ( { project } ) => {
    return (
        <div className="row-cols-1 col-md-4 d-flex mb-3">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">{ project.name }</h5>
                        <a className={'btn btn-light'} href={`project/${project.id}`}>View</a>
                    </div>
                    <p className={'small'}>{ project.client.name }</p>
                    <p className="small">Status: <strong>{ project?.status.name }</strong></p>
                </div>
            </div>
        </div>
    )
}


export default ProjectCard