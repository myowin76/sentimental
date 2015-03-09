class MainController < ApplicationController
  def index
  end

  def client_surveys
  	
  	@survey = Admin::Survey.find_by url_token: params[:survey_id]
  	
  end
end
