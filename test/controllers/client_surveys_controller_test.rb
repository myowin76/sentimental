require 'test_helper'

class ClientSurveysControllerTest < ActionController::TestCase
  setup do
    @client_survey = client_surveys(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:client_surveys)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create client_survey" do
    assert_difference('ClientSurvey.count') do
      post :create, client_survey: { email: @client_survey.email, name: @client_survey.name, survey_id: @client_survey.survey_id, text: @client_survey.text }
    end

    assert_redirected_to client_survey_path(assigns(:client_survey))
  end

  test "should show client_survey" do
    get :show, id: @client_survey
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @client_survey
    assert_response :success
  end

  test "should update client_survey" do
    patch :update, id: @client_survey, client_survey: { email: @client_survey.email, name: @client_survey.name, survey_id: @client_survey.survey_id, text: @client_survey.text }
    assert_redirected_to client_survey_path(assigns(:client_survey))
  end

  test "should destroy client_survey" do
    assert_difference('ClientSurvey.count', -1) do
      delete :destroy, id: @client_survey
    end

    assert_redirected_to client_surveys_path
  end
end
